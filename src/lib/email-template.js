/**
 * Ultra-minimalist Email Template Generator for kirian.dev
 * Clean, non-repetitive branding with full Light & Dark mode support.
 */

const DEFAULT_SITE_URL = 'https://kirian.dev';

/**
 * HTML wrapper with responsive reset and seamless Light/Dark mode styling
 */
function wrapEmailHtml({ title, contentHtml }) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${title}</title>
  <style type="text/css">
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    body {
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      margin: 0;
      padding: 0;
      background-color: #f9f9fb;
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
    
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 16px 8px !important;
      }
      .card-container {
        width: 100% !important;
        border-radius: 0px !important;
        border-left: none !important;
        border-right: none !important;
      }
      .content-padding {
        padding: 24px 20px !important;
      }
    }

    /* Dark Mode Overrides */
    @media (prefers-color-scheme: dark) {
      body, .bg-body {
        background-color: #09090b !important;
      }
      .card-container {
        background-color: #121215 !important;
        border-color: #1e1e24 !important;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4) !important;
      }
      .header-border {
        border-bottom-color: #1e1e24 !important;
      }
      .brand-title {
        color: #ffffff !important;
      }
      .brand-muted {
        color: #71717a !important;
      }
      .text-primary {
        color: #ffffff !important;
      }
      .text-body {
        color: #d4d4d8 !important;
      }
      .text-muted {
        color: #71717a !important;
      }
      .text-mono {
        color: #a1a1aa !important;
      }
      .img-card {
        border-color: #1e1e24 !important;
      }
      .btn-cta {
        background-color: #ffffff !important;
        color: #09090b !important;
      }
      .divider {
        border-top-color: #1e1e24 !important;
      }
      .footer-bg {
        background-color: #0c0c0e !important;
        border-top-color: #1e1e24 !important;
      }
      .social-link {
        color: #a1a1aa !important;
      }
      .social-bullet {
        color: #27272a !important;
      }
      .footer-text {
        color: #71717a !important;
      }
      .footer-unsubscribe {
        color: #a1a1aa !important;
      }
    }
  </style>
</head>
<body class="bg-body" style="margin: 0; padding: 0; background-color: #f9f9fb; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <table cellspacing="0" cellpadding="0" border="0" width="100%" class="bg-body" style="background-color: #f9f9fb; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;">
    <tbody>
      <tr>
        <td align="center" class="email-wrapper" style="padding: 40px 12px;">
          <!--[if (gte mso 9)|(IE)]>
          <table align="center" border="0" cellspacing="0" cellpadding="0" width="560">
            <tr>
              <td align="center" valign="top" width="560">
          <![endif]-->
          <table class="card-container" cellspacing="0" cellpadding="0" border="0" width="560" style="max-width: 560px; width: 100%; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 14px; box-shadow: 0px 2px 8px rgba(0,0,0,0.03); overflow: hidden;">
            <tbody>
              ${contentHtml}
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
</html>`;
}

/**
 * Minimal Clean Header: kirian.dev brand logo only
 */
function renderHeader(siteUrl = DEFAULT_SITE_URL) {
  return `
  <!-- Minimal Brand Header -->
  <tr>
    <td style="padding: 28px 28px 0 28px;" class="content-padding">
      <table cellspacing="0" cellpadding="0" border="0" width="100%">
        <tbody>
          <tr>
            <td align="left" valign="middle" class="header-border" style="padding-bottom: 20px; border-bottom: 1px solid #f0f0f0;">
              <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <span class="brand-title" style="font-size: 15px; font-weight: 600; color: #171717; letter-spacing: -0.3px;">kirian</span><span class="brand-muted" style="font-size: 15px; font-weight: 600; color: #737373;">.dev</span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>`;
}

/**
 * Minimal Clean Footer
 */
function renderFooter({ unsubscribeUrl, isSpanish, reasonText }) {
  const defaultReason = isSpanish
    ? 'Recibes este correo por tu suscripción a las actualizaciones del blog.'
    : 'You received this email because you subscribed to blog updates.';
  
  const text = reasonText || defaultReason;
  const unsubscribeLabel = isSpanish ? 'Desuscribirse' : 'Unsubscribe';

  return `
  <!-- Footer Component -->
  <tr>
    <td class="footer-bg content-padding" style="background-color: #fafafa; padding: 24px 28px; border-top: 1px solid #f0f0f0; text-align: center;">
      <table cellspacing="0" cellpadding="0" border="0" width="100%">
        <tbody>
          <!-- Social Links -->
          <tr>
            <td align="center" style="padding-bottom: 14px;">
              <table cellspacing="0" cellpadding="0" border="0" align="center">
                <tbody>
                  <tr>
                    <td>
                      <a class="social-link" href="https://linkedin.com/in/kirianluna" target="_blank" style="color: #525252; font-size: 12px; font-weight: 500; text-decoration: none; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">LinkedIn</a>
                    </td>
                    <td class="social-bullet" style="padding: 0 10px; color: #d4d4d4; font-size: 12px;">&bull;</td>
                    <td>
                      <a class="social-link" href="https://github.com/kirianL" target="_blank" style="color: #525252; font-size: 12px; font-weight: 500; text-decoration: none; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">GitHub</a>
                    </td>
                    <td class="social-bullet" style="padding: 0 10px; color: #d4d4d4; font-size: 12px;">&bull;</td>
                    <td>
                      <a class="social-link" href="mailto:contact@kirian.dev" style="color: #525252; font-size: 12px; font-weight: 500; text-decoration: none; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">Email</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <!-- Meta Details -->
          <tr>
            <td align="center">
              <p class="footer-text" style="margin: 0 0 6px 0; font-size: 12px; color: #737373; line-height: 1.5;">
                ${text}
              </p>
              <p class="footer-text" style="margin: 0; font-size: 12px; color: #737373; line-height: 1.5;">
                <a class="footer-unsubscribe" href="${unsubscribeUrl}" target="_blank" style="color: #737373; font-weight: 500; text-decoration: underline;">${unsubscribeLabel}</a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>`;
}

/**
 * Render email for new blog article notification
 */
export function renderNewsletterEmail(post, unsubscribeUrl, isSpanish = true, siteUrl = DEFAULT_SITE_URL) {
  const readMoreText = isSpanish ? 'Leer artículo completo' : 'Read full article';
  const postUrl = post.link.startsWith('http') ? post.link : `${siteUrl}${post.link}`;
  const imageUrl = post.image ? (post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`) : null;
  const categoryText = post.category ? post.category.toUpperCase() : null;

  const metaLine = categoryText 
    ? `${categoryText} &bull; ${post.date}`
    : post.date;

  const contentHtml = `
    ${renderHeader(siteUrl)}

    <!-- Body Content -->
    <tr>
      <td class="content-padding" style="padding: 28px 28px 28px 28px;">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
          <tbody>
            <tr>
              <td align="left">
                <!-- Clean Monospace Meta Line -->
                <div class="text-mono" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #737373; margin-bottom: 14px;">
                  ${metaLine}
                </div>

                <h1 class="text-primary" style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #171717; line-height: 1.35; letter-spacing: -0.3px;">
                  ${post.title}
                </h1>
                
                ${imageUrl ? `
                  <div class="img-card" style="margin: 20px 0 24px 0; font-size: 0px; line-height: 0px; border-radius: 8px; overflow: hidden; border: 1px solid #eaeaea;">
                    <img src="${imageUrl}" alt="${post.title}" style="display: block; width: 100%; height: auto;" />
                  </div>
                ` : ''}

                <p class="text-body" style="margin: 0 0 28px 0; font-size: 15px; color: #374151; line-height: 1.7;">
                  ${post.description}
                </p>
              </td>
            </tr>
            <!-- Clean CTA Button -->
            <tr>
              <td align="left" style="padding-bottom: 28px;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${postUrl}" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="50%" stroke="f" fillcolor="#171717">
                  <w:anchorlock/>
                  <center style="color:#ffffff;font-family:sans-serif;font-size:14px;font-weight:600;">
                    ${readMoreText} &rarr;
                  </center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="${postUrl}" target="_blank" class="btn-cta" style="background-color: #171717; color: #ffffff; display: inline-block; font-size: 14px; font-weight: 600; line-height: 44px; text-align: center; text-decoration: none; padding: 0 26px; border-radius: 9999px; -webkit-text-size-adjust: none;">
                  ${readMoreText} &rarr;
                </a>
                <!--<![endif]-->
              </td>
            </tr>
            <!-- Signature -->
            <tr>
              <td align="left" class="divider" style="padding-top: 20px; border-top: 1px solid #f0f0f0;">
                <p class="text-body" style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
                  ${isSpanish ? 'Un saludo,' : 'Best regards,'}<br />
                  <strong class="text-primary" style="color: #171717; font-weight: 600;">Kirian</strong>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>

    ${renderFooter({ unsubscribeUrl, isSpanish })}
  `;

  return wrapEmailHtml({ title: post.title, contentHtml });
}

/**
 * Render email for new subscriber welcome confirmation
 */
export function renderWelcomeEmail(unsubscribeUrl, isSpanish = true, siteUrl = DEFAULT_SITE_URL) {
  const subject = isSpanish
    ? '¡Gracias por suscribirte!'
    : "Thanks for subscribing!";
  
  const heading = isSpanish
    ? '¡Gracias por suscribirte!'
    : 'Thanks for subscribing!';

  const paragraph1 = isSpanish
    ? 'A partir de ahora recibirás notificaciones cuando publique nuevos artículos sobre ingeniería de software, rendimiento web, diseño de interfaces y desarrollo frontend.'
    : "From now on, you'll get notified whenever I publish new articles about software engineering, web performance, UI design, and frontend development.";

  const paragraph2 = isSpanish
    ? 'Si quieres leer los artículos publicados o conocer más sobre el contenido, te invito a explorar el sitio.'
    : "If you'd like to check out previous posts or learn more about the content, I invite you to explore the site.";

  const ctaText = isSpanish ? 'Explorar kirian.dev' : 'Explore kirian.dev';

  const reasonText = isSpanish
    ? `Te suscribiste a las novedades en <a href="${siteUrl}" target="_blank" style="color: #737373; font-weight: 500; text-decoration: underline;">kirian.dev</a>.`
    : `You subscribed to updates at <a href="${siteUrl}" target="_blank" style="color: #737373; font-weight: 500; text-decoration: underline;">kirian.dev</a>.`;

  const contentHtml = `
    ${renderHeader(siteUrl)}

    <!-- Body Content -->
    <tr>
      <td class="content-padding" style="padding: 28px 28px 28px 28px;">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
          <tbody>
            <tr>
              <td align="left">
                <h1 class="text-primary" style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #171717; line-height: 1.35; letter-spacing: -0.3px;">
                  ${heading}
                </h1>
                
                <p class="text-body" style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 1.7;">
                  ${isSpanish ? 'Hola,' : 'Hi there,'}
                </p>

                <p class="text-body" style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 1.7;">
                  ${paragraph1}
                </p>

                <p class="text-body" style="margin: 0 0 28px 0; font-size: 15px; color: #374151; line-height: 1.7;">
                  ${paragraph2}
                </p>
              </td>
            </tr>
            <!-- Clean CTA Button -->
            <tr>
              <td align="left" style="padding-bottom: 28px;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${siteUrl}" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="50%" stroke="f" fillcolor="#171717">
                  <w:anchorlock/>
                  <center style="color:#ffffff;font-family:sans-serif;font-size:14px;font-weight:600;">
                    ${ctaText} &rarr;
                  </center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="${siteUrl}" target="_blank" class="btn-cta" style="background-color: #171717; color: #ffffff; display: inline-block; font-size: 14px; font-weight: 600; line-height: 44px; text-align: center; text-decoration: none; padding: 0 26px; border-radius: 9999px; -webkit-text-size-adjust: none;">
                  ${ctaText} &rarr;
                </a>
                <!--<![endif]-->
              </td>
            </tr>
            <!-- Signature -->
            <tr>
              <td align="left" class="divider" style="padding-top: 20px; border-top: 1px solid #f0f0f0;">
                <p class="text-body" style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
                  ${isSpanish ? 'Un saludo,' : 'Best regards,'}<br />
                  <strong class="text-primary" style="color: #171717; font-weight: 600;">Kirian</strong>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>

    ${renderFooter({ unsubscribeUrl, isSpanish, reasonText })}
  `;

  return wrapEmailHtml({ title: subject, contentHtml });
}
