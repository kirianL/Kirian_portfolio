import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_FabCo3um_8VVh6QeJYfn4snDW6YUe8pV4');

export default async function handler(req: any, res: any) {
  // Allow OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, lang = 'en' } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // 1. Get or create audience
    let audienceId = process.env.RESEND_AUDIENCE_ID;
    
    if (!audienceId) {
      const audiencesList = await resend.audiences.list();
      const existingAudience = audiencesList.data?.data?.find(aud => aud.name === 'Blog Subscribers');
      
      if (existingAudience) {
        audienceId = existingAudience.id;
      } else {
        const newAudience = await resend.audiences.create({ name: 'Blog Subscribers' });
        if (newAudience.error) {
          throw new Error(newAudience.error.message);
        }
        audienceId = newAudience.data?.id;
      }
    }

    if (!audienceId) {
      throw new Error('Failed to identify or create audience');
    }

    // 2. Add contact to audience
    const contactResult = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false
    });

    if (contactResult.error) {
      // If contact already exists, return success or a friendly message
      if (contactResult.error.message.includes('already exists') || contactResult.error.message.includes('duplicate')) {
        return res.status(200).json({ message: 'Successfully subscribed!' });
      }
      return res.status(400).json({ error: contactResult.error.message });
    }

    // 3. Send welcome email
    const sender = process.env.RESEND_SENDER || 'onboarding@resend.dev';
    const isSpanish = lang === 'es';
    const subject = isSpanish ? '¡Bienvenido al boletín de Kirian Luna!' : "Welcome to Kirian Luna's newsletter!";
    
    const unsubscribeUrl = `https://kirian.dev/api/unsubscribe?email=${encodeURIComponent(email)}`;

    const welcomeHtml = isSpanish ? `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>\${subject}</title>
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
                                <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1.3; letter-spacing: -0.5px;">¡Gracias por suscribirte!</h1>
                                <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">Hola,</p>
                                <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">Te has suscrito con éxito a mi boletín. A partir de ahora recibirás notificaciones cuando publique nuevos artículos sobre ingeniería de software, optimización de rendimiento web, diseño de interfaces y desarrollo frontend.</p>
                                <p style="margin: 0 0 24px 0; font-size: 15px; color: #334155; line-height: 1.6;">Si quieres leer los artículos publicados o conocer más sobre mi trabajo, te invito a explorar mi portafolio digital.</p>
                              </td>
                            </tr>
                            <!-- CTA Button -->
                            <tr>
                              <td align="left" style="padding-bottom: 24px;">
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://kirian.dev" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="50%" stroke="f" fillcolor="#171717">
                                  <w:anchorlock/>
                                  <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">Visitar kirian.dev</center>
                                </v:roundrect>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <a href="https://kirian.dev" target="_blank" style="background-color: #171717; color: #ffffff; display: inline-block; font-size: 15px; font-weight: 600; line-height: 48px; text-align: center; text-decoration: none; width: auto; min-width: 180px; padding: 0 24px; border-radius: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); -webkit-text-size-adjust: none;">Visitar kirian.dev</a>
                                <!--<![endif]-->
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="padding-top: 16px; border-top: 1px solid #f1f5f9;">
                                <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                  ¡Un saludo!<br />
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
                                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.5;">Copyright &copy; 2026 Kirian Luna. All rights reserved.</p>
                                <p style="margin: 0 0 16px 0; font-size: 12px; color: #64748b; line-height: 1.5;">Recibiste este correo porque te suscribiste al boletín en <a href="https://kirian.dev" target="_blank" style="color: #0f172a; font-weight: 600; text-decoration: none;">kirian.dev</a>.</p>
                                <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">¿No deseas recibir más correos? <a href="${unsubscribeUrl}" target="_blank" style="color: #64748b; font-weight: 600; text-decoration: underline;">Desuscribirse aquí</a>.</p>
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
    ` : `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>\${subject}</title>
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
                                <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1.3; letter-spacing: -0.5px;">Thanks for subscribing!</h1>
                                <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">Hi there,</p>
                                <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">You have successfully subscribed to my newsletter. From now on, you'll get notified whenever I publish new articles about software engineering, web performance, UI design, and frontend development.</p>
                                <p style="margin: 0 0 24px 0; font-size: 15px; color: #334155; line-height: 1.6;">If you'd like to check out previous posts or learn more about my work, I invite you to explore my digital portfolio.</p>
                              </td>
                            </tr>
                            <!-- CTA Button -->
                            <tr>
                              <td align="left" style="padding-bottom: 24px;">
                                <!--[if mso]>
                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://kirian.dev" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="50%" stroke="f" fillcolor="#171717">
                                  <w:anchorlock/>
                                  <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">Visit kirian.dev</center>
                                </v:roundrect>
                                <![endif]-->
                                <!--[if !mso]><!-->
                                <a href="https://kirian.dev" target="_blank" style="background-color: #171717; color: #ffffff; display: inline-block; font-size: 15px; font-weight: 600; line-height: 48px; text-align: center; text-decoration: none; width: auto; min-width: 180px; padding: 0 24px; border-radius: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); -webkit-text-size-adjust: none;">Visit kirian.dev</a>
                                <!--<![endif]-->
                              </td>
                            </tr>
                            <tr>
                              <td align="left" style="padding-top: 16px; border-top: 1px solid #f1f5f9;">
                                <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                  Best regards,<br />
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
                                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.5;">Copyright &copy; 2026 Kirian Luna. All rights reserved.</p>
                                <p style="margin: 0 0 16px 0; font-size: 12px; color: #64748b; line-height: 1.5;">You received this email because you signed up for the newsletter at <a href="https://kirian.dev" target="_blank" style="color: #0f172a; font-weight: 600; text-decoration: none;">kirian.dev</a>.</p>
                                <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">No longer want to receive these emails? <a href="${unsubscribeUrl}" target="_blank" style="color: #64748b; font-weight: 600; text-decoration: underline;">Unsubscribe here</a>.</p>
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

    await resend.emails.send({
      from: sender,
      to: email,
      subject: subject,
      html: welcomeHtml
    });

    return res.status(200).json({ message: 'Successfully subscribed!' });
  } catch (error: any) {
    console.error('Subscription Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
