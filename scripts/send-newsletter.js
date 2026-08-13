import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import { renderNewsletterEmail } from '../src/lib/email-template.js';

// Initialize Resend
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.log('Error: RESEND_API_KEY environment variable is not defined.');
  process.exit(0); // Exit gracefully during build if not configured
}

const resend = new Resend(apiKey);
const sender = process.env.RESEND_SENDER || 'onboarding@resend.dev';
const siteUrl = 'https://kirian.dev'; // Base production URL

// Helper to parse YAML frontmatter from markdown
function parseMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---([\s\S]*?)---/);
  if (!match) return { data: {}, content };
  
  const yamlStr = match[1];
  const data = {};
  yamlStr.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim().replace(/^['"]|['"]$/g, '');
      if (key) data[key] = value;
    }
  });
  
  return { data, content: content.replace(/^---[\s\S]*?---/, '').trim() };
}


async function run() {
  const sentFilePath = path.join(process.cwd(), 'src/data/sent-newsletter.json');
  let state = { sent: [] };

  if (fs.existsSync(sentFilePath)) {
    try {
      state = JSON.parse(fs.readFileSync(sentFilePath, 'utf-8'));
    } catch (e) {
      console.error('Failed to parse sent-newsletter.json, creating a new one.');
    }
  }

  // Load and parse all markdown posts from both languages
  const posts = [];
  const findPosts = (dir, isSpanish) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const slug = file.replace(/\.md$/, '');
        const fullPath = path.join(dir, file);
        const { data } = parseMarkdown(fullPath);
        posts.push({
          slug,
          title: data.title,
          description: data.description,
          date: data.date,
          category: data.category,
          image: data.image,
          isSpanish,
          link: isSpanish ? `/es/blog/${slug}/` : `/blog/${slug}/`
        });
      }
    });
  };

  findPosts(path.join(process.cwd(), 'src/content/blog/en'), false);
  findPosts(path.join(process.cwd(), 'src/content/blog/es'), true);

  // Find unsent posts
  const unsentPosts = posts.filter(post => !state.sent.includes(post.slug));

  if (unsentPosts.length === 0) {
    console.log('No new articles to broadcast.');
    return;
  }

  console.log(`Found ${unsentPosts.length} new articles to send.`);

  // Find or create Resend Segment ID for 'Blog Subscribers'
  let segmentId = process.env.RESEND_AUDIENCE_ID;
  if (!segmentId) {
    const segmentsList = await resend.segments.list();
    const existingSegment = segmentsList.data?.data?.find(seg => seg.name === 'Blog Subscribers');
    if (existingSegment) {
      segmentId = existingSegment.id;
    } else {
      console.log('Creating "Blog Subscribers" segment...');
      const newSegment = await resend.segments.create({ name: 'Blog Subscribers' });
      if (newSegment.error) {
        console.error('Failed to create segment in Resend:', newSegment.error.message);
        return;
      }
      segmentId = newSegment.data?.id;
    }
  }

  if (!segmentId) {
    console.error('Error: Could not identify or create "Blog Subscribers" segment.');
    return;
  }

  // Fetch all contacts in audience/segment to verify we have subscribers
  const contactsResponse = await resend.contacts.list({ audienceId: segmentId });
  const contacts = contactsResponse.data?.data || [];

  if (contacts.length === 0) {
    console.log('No subscribers found in the "Blog Subscribers" segment. Storing post slugs as sent without emailing.');
    unsentPosts.forEach(post => state.sent.push(post.slug));
    fs.writeFileSync(sentFilePath, JSON.stringify(state, null, 2));
    return;
  }

  console.log(`Sending broadcast to segment "${segmentId}"...`);

  // Loop through each unsent post
  for (const post of unsentPosts) {
    const unsubscribeUrl = '{{{RESEND_UNSUBSCRIBE_URL}}}';
    const htmlContent = renderNewsletterEmail(post, unsubscribeUrl, post.isSpanish);
    const subject = post.isSpanish ? `Nuevo artículo: ${post.title}` : `New article: ${post.title}`;

    try {
      console.log(`Creating and sending broadcast for: "${post.title}"...`);
      const broadcastResult = await resend.broadcasts.create({
        segmentId: segmentId,
        from: sender,
        subject: subject,
        html: htmlContent,
        send: true
      });

      if (broadcastResult.error) {
        console.error('Failed to send broadcast:', broadcastResult.error.message);
      } else {
        console.log(`Broadcast sent successfully. ID: ${broadcastResult.data.id}`);
        state.sent.push(post.slug);
      }
    } catch (err) {
      console.error(`Network or unexpected error while broadcasting post "${post.slug}":`, err);
    }
  }

  // Save the sent list state back to the file
  fs.writeFileSync(sentFilePath, JSON.stringify(state, null, 2));
  console.log('Newsletter state updated successfully.');
}

run().catch(console.error);
