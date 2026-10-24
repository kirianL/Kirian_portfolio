import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const SENDER_EMAIL = process.env.RESEND_CONTACT_SENDER || "Kirian Luna <contact@kirian.dev>";
const RECIPIENT_EMAIL = "kirianluna.u@gmail.com";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params);
      }
    }
    body = body || {};

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    const honeypot = String(body.website || body._gotcha || "").trim();

    // Silent bot trap: if honeypot is filled, return success without sending
    if (honeypot) {
      return res.status(200).json({ success: true });
    }

    // Validation
    if (!name || name.length > 120) {
      return res.status(400).json({ error: "Please provide a valid name (up to 120 characters)." });
    }

    if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    if (!message || message.length < 2 || message.length > 5000) {
      return res.status(400).json({ error: "Message must be between 2 and 5000 characters." });
    }

    if (!resend) {
      console.error("RESEND_API_KEY is not configured.");
      return res.status(500).json({ error: "Email service is temporarily unavailable." });
    }

    const sanitizedMessage = message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px 24px; color: #18181b; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 14px;">
        <div style="margin-bottom: 20px; border-bottom: 1px solid #f4f4f5; padding-bottom: 14px;">
          <h2 style="margin: 0; font-size: 17px; font-weight: 600; color: #09090b; letter-spacing: -0.01em;">
            New Inquiry via kirian.dev
          </h2>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #71717a; width: 75px; vertical-align: top;">From:</td>
            <td style="padding: 6px 0; color: #09090b; font-weight: 500;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a; vertical-align: top;">Email:</td>
            <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #059669; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a; vertical-align: top;">Date:</td>
            <td style="padding: 6px 0; color: #71717a;">${new Date().toLocaleString("en-US", { timeZone: "America/Costa_Rica" })} (Costa Rica)</td>
          </tr>
        </table>

        <div style="margin-top: 14px; padding: 18px; background-color: #fafafa; border: 1px solid #f4f4f5; border-radius: 10px; font-size: 13px; line-height: 1.6; color: #27272a; white-space: pre-wrap;">${sanitizedMessage}</div>

        <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #f4f4f5; font-size: 11px; color: #a1a1aa;">
          You can reply directly to this email to respond to ${name} &lt;${email}&gt;.
        </div>
      </div>
    `;

    const textContent = `New message from: ${name} (${email})\nDate: ${new Date().toISOString()}\n\n${message}`;

    const { error: resendError } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [RECIPIENT_EMAIL],
      replyTo: email,
      subject: `New inquiry from ${name} via kirian.dev`,
      html: htmlContent,
      text: textContent,
    });

    if (resendError) {
      console.error("Resend API error:", resendError);
      return res.status(500).json({ error: resendError.message || "Failed to deliver email" });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Contact API exception:", err);
    return res.status(500).json({ error: err.message || "An unexpected error occurred" });
  }
}
