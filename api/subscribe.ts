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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #171717; max-width: 600px; margin: 0 auto; padding: 24px; }
          h1 { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #171717; }
          p { font-size: 14px; margin-bottom: 16px; color: #404040; }
          .footer { margin-top: 48px; border-top: 1px solid #f3f4f6; padding-top: 16px; font-size: 11px; color: #a3a3a3; font-family: monospace; }
          a { color: #171717; text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>¡Gracias por suscribirte!</h1>
        <p>Hola,</p>
        <p>Te has suscrito con éxito a mi boletín. A partir de ahora recibirás notificaciones cuando publique nuevos artículos sobre ingeniería de software, optimización de rendimiento web, diseño de interfaces y desarrollo frontend.</p>
        <p>Si quieres leer los artículos publicados o conocer más sobre mi trabajo, puedes visitar mi sitio web en <a href="https://kirian.dev">kirian.dev</a>.</p>
        <p>¡Un saludo!<br>Kirian Luna</p>
        <div class="footer">
          Si no deseas seguir recibiendo estos correos, puedes desuscribirte haciendo clic en <a href="${unsubscribeUrl}">este enlace</a>.
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #171717; max-width: 600px; margin: 0 auto; padding: 24px; }
          h1 { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #171717; }
          p { font-size: 14px; margin-bottom: 16px; color: #404040; }
          .footer { margin-top: 48px; border-top: 1px solid #f3f4f6; padding-top: 16px; font-size: 11px; color: #a3a3a3; font-family: monospace; }
          a { color: #171717; text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>Thanks for subscribing!</h1>
        <p>Hi there,</p>
        <p>You have successfully subscribed to my newsletter. From now on, you'll get notified whenever I publish new articles about software engineering, web performance, UI design, and frontend development.</p>
        <p>If you'd like to check out previous posts or learn more about my work, feel free to visit <a href="https://kirian.dev">kirian.dev</a>.</p>
        <p>Best regards,<br>Kirian Luna</p>
        <div class="footer">
          If you no longer wish to receive these emails, you can unsubscribe by clicking <a href="${unsubscribeUrl}">this link</a>.
        </div>
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
