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
    ? 'Recibes este correo porque te suscribiste a las actualizaciones del blog de Kirian Luna.'
    : 'You received this email because you signed up for blog updates from Kirian Luna.';
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
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          margin: 0;
          padding: 0;
          background-color: #f8f9fa;
        }
        table {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
          border: none;
        }
        @media (max-width: 600px) {
          .container {
            width: 100% !important;
            border-radius: 0px !important;
            border-left: none !important;
            border-right: none !important;
          }
          .content-padding {
            padding: 30px 20px !important;
          }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f9fa; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
      <table cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <tbody>
          <tr>
            <td align="center" style="padding: 40px 10px 40px 10px;">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                  <td align="center" valign="top" width="600">
              <![endif]-->
              <table class="container" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden;">
                <tbody>
                  <!-- Header -->
                  <tr>
                    <td style="padding: 32px 32px 0 32px;" class="content-padding">
                      <table cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tbody>
                          <tr>
                            <td align="left" valign="middle" style="padding-bottom: 24px; border-bottom: 1px solid #f1f5f9;">
                              <table cellspacing="0" cellpadding="0" border="0">
                                <tbody>
                                  <tr>
                                    <td style="padding-right: 12px; font-size: 0px; line-height: 0px;">
                                      <img src="https://kirian.dev/profile.webp" width="40" height="40" alt="Kirian Luna" style="display: block; border-radius: 50%; width: 40px; height: 40px; border: 1px solid #e2e8f0;" />
                                    </td>
                                    <td>
                                      <div style="font-size: 15px; font-weight: 600; color: #0f172a; line-height: 1.2;">Kirian Luna</div>
                                      <div style="font-size: 12px; font-weight: 500; color: #64748b; margin-top: 2px;">Systems Engineer</div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <!-- Body Content -->
                  <tr>
                    <td class="content-padding" style="padding: 32px 32px 32px 32px;">
                      <table cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tbody>
                          <tr>
                            <td align="left">
                              <div style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 8px;">
                                ${post.category} &bull; ${post.date}
                              </div>
                              <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1.3; letter-spacing: -0.5px;">
                                ${post.title}
                              </h1>
                              
                              ${post.image ? `
                                <div style="margin-bottom: 24px; font-size: 0px; line-height: 0px; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
                                  <img src="${imageUrl}" alt="${post.title}" style="display: block; width: 100%; height: auto;" />
                                </div>
                              ` : ''}

                              <p style="margin: 0 0 28px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                ${post.description}
                              </p>
                            </td>
                          </tr>
                          <!-- CTA Button -->
                          <tr>
                            <td align="left" style="padding-bottom: 24px;">
                              <!--[if mso]>
                              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${postUrl}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="50%" stroke="f" fillcolor="#171717">
                                <w:anchorlock/>
                                <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">
                                  ${readMoreText}
                                </center>
                              </v:roundrect>
                              <![endif]-->
                              <!--[if !mso]><!-->
                              <a href="${postUrl}" target="_blank" style="background-color: #171717; color: #ffffff; display: inline-block; font-size: 15px; font-weight: 600; line-height: 48px; text-align: center; text-decoration: none; width: auto; min-width: 180px; padding: 0 28px; border-radius: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); -webkit-text-size-adjust: none;">
                                ${readMoreText}
                              </a>
                              <!--<![endif]-->
                            </td>
                          </tr>
                          <tr>
                            <td align="left" style="padding-top: 16px; border-top: 1px solid #f1f5f9;">
                              <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                ${isSpanish ? '¡Un saludo!' : 'Best regards,'}<br />
                                <strong style="color: #0f172a;">Kirian Luna</strong>
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <!-- Footer / Connect -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 32px 32px; border-top: 1px solid #e2e8f0; text-align: center;" class="content-padding">
                      <table cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tbody>
                          <!-- Social Links -->
                          <tr>
                            <td align="center" style="padding-bottom: 20px;">
                              <table cellspacing="0" cellpadding="0" border="0" align="center">
                                <tbody>
                                  <tr>
                                    <td>
                                      <a href="https://linkedin.com/in/kirianluna" target="_blank" style="color: #0f172a; font-size: 13px; font-weight: 600; text-decoration: none; font-family: monospace;">LinkedIn</a>
                                    </td>
                                    <td style="padding: 0 12px; color: #cbd5e1; font-size: 13px;">&bull;</td>
                                    <td>
                                      <a href="https://github.com/kirianL" target="_blank" style="color: #0f172a; font-size: 13px; font-weight: 600; text-decoration: none; font-family: monospace;">GitHub</a>
                                    </td>
                                    <td style="padding: 0 12px; color: #cbd5e1; font-size: 13px;">&bull;</td>
                                    <td>
                                      <a href="mailto:contact@kirian.dev" style="color: #0f172a; font-size: 13px; font-weight: 600; text-decoration: none; font-family: monospace;">Email</a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <!-- Meta Details -->
                          <tr>
                            <td align="center">
                              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                                Copyright &copy; 2026 Kirian Luna. All rights reserved.
                              </p>
                              <p style="margin: 0 0 16px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                                ${reasonText}
                              </p>
                              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                                ${isSpanish ? '¿No deseas recibir más correos?' : 'No longer want to receive these emails?'} <a href="${unsubscribeUrl}" target="_blank" style="color: #64748b; font-weight: 600; text-decoration: underline;">${unsubscribeLabel}</a>.
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if (gte mso 9)|(IE)]>
                  </td>
                </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
        </tbody>
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
    const htmlContent = renderEmail(post, unsubscribeUrl, post.isSpanish);
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
