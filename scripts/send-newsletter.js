import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

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

// Minimalist HTML email template aligned with portfolio design system
function renderEmail(post, unsubscribeUrl, isSpanish) {
  const readMoreText = isSpanish ? 'Leer artículo completo' : 'Read full article';
  const reasonText = isSpanish 
    ? 'Recibes este correo porque te suscribiste a las actualizaciones del blog de Kirian Luna Quirós.'
    : 'You received this email because you signed up for blog updates from Kirian Luna Quirós.';
  const unsubscribeLabel = isSpanish ? 'Desuscribirse aquí' : 'Unsubscribe here';
  
  // Resolve absolute image URL
  const imageUrl = post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`;
  const postUrl = `${siteUrl}${post.link}`;

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${post.title}</title>
        <style type="text/css">
          body {
            width: 100% !important;
            margin: 0;
            padding: 0;
            background-color: #fcfcfc;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          table {
            border-collapse: collapse;
          }
          img {
            outline: none;
            text-decoration: none;
            border: none;
          }
          .content-table {
            width: 100%;
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
          }
          .header {
            padding: 32px 32px 20px 32px;
            border-bottom: 1px solid #f5f5f5;
          }
          .logo {
            font-size: 14px;
            font-weight: 600;
            color: #171717;
            text-decoration: none;
            letter-spacing: -0.02em;
          }
          .body {
            padding: 32px;
          }
          .category {
            font-size: 10px;
            font-family: monospace;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #646464;
            margin-bottom: 8px;
          }
          .title {
            font-size: 22px;
            font-weight: 700;
            color: #202020;
            line-height: 1.3;
            margin: 0 0 16px 0;
            letter-spacing: -0.02em;
          }
          .cover-image {
            width: 100%;
            height: auto;
            border-radius: 10px;
            margin-bottom: 24px;
            border: 1px solid #f0f0f0;
          }
          .description {
            font-size: 14px;
            line-height: 1.6;
            color: #646464;
            margin-bottom: 32px;
          }
          .btn-container {
            text-align: center;
            margin-bottom: 16px;
          }
          .btn {
            display: inline-block;
            font-size: 13px;
            font-weight: 600;
            color: #fafafa !important;
            background-color: #171717;
            padding: 12px 32px;
            border-radius: 10px;
            text-decoration: none;
            transition: background-color 0.2s;
          }
          .footer {
            background-color: #eff2f7;
            padding: 24px 32px;
            text-align: center;
            font-size: 12px;
            color: #3b3f44;
            line-height: 1.5;
            border-top: 1px solid #e5e5e5;
          }
          .footer a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center">
              <table role="presentation" class="content-table" cellspacing="0" cellpadding="0" border="0">
                <!-- Header -->
                <tr>
                  <td class="header" align="left">
                    <a href="${siteUrl}" class="logo">KIRIAN LUNA QUIRÓS</a>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td class="body" align="left">
                    <div class="category">${post.category} — ${post.date}</div>
                    <h1 class="title">${post.title}</h1>
                    ${post.image ? `<img src="${imageUrl}" alt="${post.title}" class="cover-image" />` : ''}
                    <p class="description">${post.description}</p>
                    <div class="btn-container">
                      <a href="${postUrl}" class="btn" target="_blank">${readMoreText}</a>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td class="footer">
                    <p style="margin: 0 0 8px 0;">${reasonText}</p>
                    <p style="margin: 0;"><a href="${unsubscribeUrl}">${unsubscribeLabel}</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
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

  // Find Resend Audience ID
  let audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    const audiencesList = await resend.audiences.list();
    const existingAudience = audiencesList.data?.find(aud => aud.name === 'Blog Subscribers');
    if (existingAudience) {
      audienceId = existingAudience.id;
    }
  }

  if (!audienceId) {
    console.log('Error: Could not find "Blog Subscribers" audience in Resend. Please ensure subscribers exist.');
    return;
  }

  // Fetch all contacts in audience
  const contactsResponse = await resend.contacts.list({ audienceId });
  const contacts = contactsResponse.data || [];

  if (contacts.length === 0) {
    console.log('No subscribers found in the Resend Audience. Storing post slugs as sent without emailing.');
    unsentPosts.forEach(post => state.sent.push(post.slug));
    fs.writeFileSync(sentFilePath, JSON.stringify(state, null, 2));
    return;
  }

  console.log(`Sending to ${contacts.length} subscribers...`);

  // Loop through each unsent post
  for (const post of unsentPosts) {
    const batch = [];
    
    // Create personalized email for each contact (for the custom unsubscribe link)
    for (const contact of contacts) {
      // Prevent emailing contacts that are unsubscribed inside Resend
      if (contact.unsubscribed) continue;

      const unsubscribeUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(contact.email)}`;
      const htmlContent = renderEmail(post, unsubscribeUrl, post.isSpanish);
      const subject = post.isSpanish ? `Nuevo artículo: ${post.title}` : `New article: ${post.title}`;

      batch.push({
        from: sender,
        to: contact.email,
        subject: subject,
        html: htmlContent
      });
    }

    // Chunk batch into chunks of 100 (Resend limit is 150)
    const chunkSize = 100;
    for (let i = 0; i < batch.length; i += chunkSize) {
      const chunk = batch.slice(i, i + chunkSize);
      try {
        const result = await resend.batch.send(chunk);
        if (result.error) {
          console.error('Failed to send email chunk:', result.error);
        } else {
          console.log(`Sent chunk of ${chunk.length} emails successfully.`);
        }
      } catch (err) {
        console.error('Network error while sending chunk:', err);
      }
    }

    // Add post to sent list
    state.sent.push(post.slug);
  }

  // Save the sent list state back to the file
  fs.writeFileSync(sentFilePath, JSON.stringify(state, null, 2));
  console.log('Newsletter state updated successfully.');
}

run().catch(console.error);
