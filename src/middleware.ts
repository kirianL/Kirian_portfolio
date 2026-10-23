import { defineMiddleware } from "astro:middleware";
import fs from "node:fs";
import path from "node:path";

let cachedLlmsFull: string | null = null;
let cachedLlms: string | null = null;

function getMarkdownContent(): string {
  if (cachedLlmsFull) return cachedLlmsFull;
  try {
    const filePath = path.join(process.cwd(), "public", "llms-full.txt");
    if (fs.existsSync(filePath)) {
      cachedLlmsFull = fs.readFileSync(filePath, "utf-8");
      return cachedLlmsFull;
    }
  } catch {}
  return `# Kirian Luna — Software Engineer & Builder

> Kirian Luna (kirian.dev) is a Software Engineer from Limón, Costa Rica (UTC-6), specialized in full-stack web engineering, systems architecture, and modern UX design.

## Core Information
- Name: Kirian Luna
- Role: Software Engineer / Full-Stack Developer
- Location: Limón, Costa Rica (UTC-6 / CST)
- Primary Domain: https://kirian.dev
- Email: kirianluna.u@gmail.com
- GitHub: https://github.com/kirianL
- LinkedIn: https://linkedin.com/in/kirianluna

## Services & Expertise
- Full-stack web application development (TypeScript, Next.js, React, Astro, Node.js, PostgreSQL, Prisma)
- API design and integration (REST, webhooks, authentication, role-based access control)
- Performance & accessibility engineering (Core Web Vitals, SXO, WCAG compliance)
- UI/UX engineering with modern micro-animations and clean design systems

## Navigation
- [About](https://kirian.dev/about)
- [Projects](https://kirian.dev/projects)
- [Writing / Blog](https://kirian.dev/blog)
- [Contact](https://kirian.dev/contact)
- [Privacy Policy](https://kirian.dev/privacy)
- [XML Sitemap](https://kirian.dev/sitemap-index.xml)
- [Complete LLMs Profile](https://kirian.dev/llms-full.txt)
`;
}

const MARKDOWN_404 = `# 404 - Resource Not Found

The requested resource does not exist on kirian.dev.

## Helpful Links & Documentation
- [Home / Portfolio](https://kirian.dev/)
- [About Kirian Luna](https://kirian.dev/about)
- [Featured Projects](https://kirian.dev/projects)
- [Articles & Blog](https://kirian.dev/blog)
- [Contact](https://kirian.dev/contact)
- [Privacy Policy](https://kirian.dev/privacy)
- [LLMs Overview (llms.txt)](https://kirian.dev/llms.txt)
- [LLMs Full Documentation (llms-full.txt)](https://kirian.dev/llms-full.txt)
- [XML Sitemap](https://kirian.dev/sitemap-index.xml)

Please verify the URL or visit one of the index resources above to locate the desired content.
`;

const MARKDOWN_ABOUT = `# About Kirian Luna — Software Engineer & Builder

> Kirian Luna is a Software Engineer and systems architect based in Limón, Costa Rica (CST / UTC-6), with a degree in Systems Engineering from Universidad Latina de Costa Rica.

## Background & Philosophy
Kirian combines systems engineering rigor with modern product design. His philosophy centers on simplicity, speed, type-safety, and durable architectures that age gracefully without technical debt.

## Core Capabilities & Services
- **Full-Stack Web Engineering**: TypeScript, React 19, Next.js (App Router), Astro, TailwindCSS.
- **Backend & Database Architecture**: PostgreSQL, Prisma ORM, Redis caching, RESTful API design, JWT auth, RBAC.
- **Design Systems & Micro-Interactions**: Web Audio API (cuelume), accessible UI (WCAG 2.1), Core Web Vitals 100/100.
- **Technical Consulting & Audits**: Code review, latency profiling, search experience optimization (SXO).

## Pricing & Engagement Models
- **Milestone / Fixed-Price Projects**: From $1,200 USD for well-defined web systems and platforms.
- **Monthly Retainer / Consulting**: Dedicated engineering and architecture guidance.
- **Full-Time Engineering Roles**: Remote positions as Frontend, Backend, or Full-Stack Engineer.

## Verification & Contact
- Email: kirianluna.u@gmail.com
- Domain: https://kirian.dev
- LinkedIn: https://linkedin.com/in/kirianluna
- GitHub: https://github.com/kirianL
`;

const MARKDOWN_PRIVACY = `# Privacy Policy — kirian.dev

> Last updated: October 23, 2026. This policy explains data practices on kirian.dev.

## 1. Scope & Identity
kirian.dev is operated by Kirian Luna in Limón, Costa Rica. We practice privacy-by-design: minimal data collection, zero invasive ad tracking, and no sale of personal data.

## 2. Data Handled
- **Contact Inquiries**: Name, email, and message content submitted via the contact form are used solely to reply to professional inquiries.
- **Analytics**: Cookieless, privacy-preserving aggregate metrics via PostHog.
- **Reactions**: Blog post reactions use non-reversible cryptographic hashes in Redis (Upstash) solely for rate limiting and duplicate prevention.

## 3. Infrastructure
Edge hosting by Vercel; form dispatch by Formspree; Redis storage by Upstash; analytics by PostHog.

## 4. User Rights
Users may request access, correction, or deletion of data at any time under GDPR, CCPA, and Costa Rica Law No. 8968 by emailing: kirianluna.u@gmail.com.
`;

const MARKDOWN_CONTACT = `# Contact Kirian Luna

Get in touch for software engineering, architecture consulting, or full-time opportunities.

## Direct Channels
- **Email**: kirianluna.u@gmail.com
- **LinkedIn**: https://linkedin.com/in/kirianluna
- **GitHub**: https://github.com/kirianL
- **X (Twitter)**: https://x.com/kiriandev
- **Web Form**: https://kirian.dev/contact

## Availability & Response Time
- **Current Status**: Open to work (client projects, consulting, and full-time remote engineering).
- **Response Time**: Within 24 business hours.
- **Location**: Limón, Costa Rica (CST / UTC-6).
`;

export const onRequest = defineMiddleware(async (context, next) => {
  const acceptHeader = context.request.headers.get("accept") || "";
  const wantsMarkdown = acceptHeader.includes("text/markdown");
  const pathname = context.url.pathname.replace(/\/$/, "") || "/";

  // 1. Content Negotiation on scanned root paths or direct markdown requests
  if (wantsMarkdown) {
    let mdBody: string | null = null;
    if (pathname === "/" || pathname === "/es") {
      mdBody = getMarkdownContent();
    } else if (pathname === "/about" || pathname === "/es/about") {
      mdBody = MARKDOWN_ABOUT;
    } else if (pathname === "/privacy" || pathname === "/es/privacy") {
      mdBody = MARKDOWN_PRIVACY;
    } else if (pathname === "/contact" || pathname === "/es/contact") {
      mdBody = MARKDOWN_CONTACT;
    }

    if (mdBody) {
      return new Response(mdBody, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Vary": "Accept",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  }

  // 2. Execute normal route handling
  const response = await next();

  // 3. Agent-friendly 404 handling with Markdown content negotiation
  if (response.status === 404 && wantsMarkdown) {
    return new Response(MARKDOWN_404, {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Vary": "Accept",
      },
    });
  }

  // 4. Ensure Vary header contains Accept for proper HTTP cache and agent evaluation
  const currentVary = response.headers.get("vary") || "";
  if (!currentVary.toLowerCase().includes("accept")) {
    const newVary = currentVary ? `${currentVary}, Accept` : "Accept";
    response.headers.set("vary", newVary);
  }

  return response;
});
