export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const SENDER_EMAIL = process.env.RESEND_CONTACT_SENDER || "Kirian Luna <contact@kirian.dev>";
const RECIPIENT_EMAIL = "kirianluna.u@gmail.com";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  try {
    let name = "";
    let email = "";
    let message = "";
    let honeypot = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      name = (body.name || "").trim();
      email = (body.email || "").trim();
      message = (body.message || "").trim();
      honeypot = (body.website || body._gotcha || "").trim();
    } else {
      const formData = await request.formData().catch(() => new FormData());
      name = String(formData.get("name") || "").trim();
      email = String(formData.get("email") || "").trim();
      message = String(formData.get("message") || "").trim();
      honeypot = String(formData.get("website") || formData.get("_gotcha") || "").trim();
    }

    // Silent bot trap: if honeypot is filled, return success without sending
    if (honeypot) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validation
    if (!name || name.length > 120) {
      return new Response(JSON.stringify({ error: "Please provide a valid name (up to 120 characters)." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
      return new Response(JSON.stringify({ error: "Please provide a valid email address." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!message || message.length < 2 || message.length > 5000) {
      return new Response(JSON.stringify({ error: "Message must be between 2 and 5000 characters." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!resend) {
      console.error("RESEND_API_KEY is not configured.");
      return new Response(JSON.stringify({ error: "Email service is temporarily unavailable." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
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
      return new Response(JSON.stringify({ error: resendError.message || "Failed to deliver email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Contact API exception:", err);
    return new Response(JSON.stringify({ error: err.message || "An unexpected error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
