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

  const { email } = req.body;
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

    return res.status(200).json({ message: 'Successfully subscribed!' });
  } catch (error: any) {
    console.error('Subscription Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
