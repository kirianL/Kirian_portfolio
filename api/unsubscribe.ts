import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_FabCo3um_8VVh6QeJYfn4snDW6YUe8pV4');

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  const { email } = req.query;
  if (!email || !email.includes('@')) {
    return res.status(400).send('Invalid email parameter');
  }

  try {
    // 1. Find the audience ID
    let audienceId = process.env.RESEND_AUDIENCE_ID;
    
    if (!audienceId) {
      const audiencesList = await resend.audiences.list();
      const existingAudience = audiencesList.data?.find(aud => aud.name === 'Blog Subscribers');
      if (existingAudience) {
        audienceId = existingAudience.id;
      }
    }

    if (!audienceId) {
      return res.status(404).send('Audience not found');
    }

    // 2. Remove contact from audience
    const removeResult = await resend.contacts.remove({
      email,
      audienceId
    });

    if (removeResult.error) {
      // If contact not found or already deleted, don't fail drastically for the user
      if (removeResult.error.message.includes('not found')) {
        return res.status(200).send('Email already unsubscribed.');
      }
      return res.status(400).send(`Error: ${removeResult.error.message}`);
    }

    // Return a clean HTML confirmation page
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Desuscripción Completada</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #fcfcfc;
              color: #202020;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .card {
              background-color: #ffffff;
              padding: 2rem;
              border-radius: 14px;
              border: 1px solid #e5e5e5;
              text-align: center;
              max-width: 400px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.02);
            }
            h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
            p { font-size: 0.875rem; color: #646464; line-height: 1.5; margin-bottom: 1.5rem; }
            a { display: inline-block; font-size: 0.875rem; font-weight: 500; color: #ffffff; background-color: #171717; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; transition: opacity 0.2s; }
            a:hover { opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Desuscripción exitosa</h1>
            <p>Tu correo <strong>${email}</strong> ha sido eliminado del boletín. No recibirás más notificaciones sobre nuevos artículos.</p>
            <a href="https://kirian.dev">Volver al inicio</a>
          </div>
        </body>
      </html>
    `);
  } catch (error: any) {
    return res.status(500).send(`Internal Server Error: ${error.message}`);
  }
}
