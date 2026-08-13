import fs from 'fs';
import path from 'path';
import { renderNewsletterEmail, renderWelcomeEmail } from '../src/lib/email-template.js';

const mockPost = {
  title: 'Optimizando el rendimiento en Astro 5 y Next.js',
  description: 'Un análisis profundo sobre las mejores prácticas de renderizado híbrido, hidratación parcial e imágenes adaptativas para lograr puntuaciones perfectas en Lighthouse.',
  date: '09 AGO 2026',
  category: 'INGENIERÍA',
  image: '/profile.webp',
  link: '/es/blog/optimizando-rendimiento-astro-5/'
};

const unsubscribeUrl = 'https://kirian.dev/api/unsubscribe?email=test%40example.com';

const newsletterHtmlEs = renderNewsletterEmail(mockPost, unsubscribeUrl, true);
const newsletterHtmlEn = renderNewsletterEmail({ ...mockPost, category: 'ENGINEERING', title: 'Optimizing Performance in Astro 5 & Next.js', link: '/blog/optimizando-rendimiento-astro-5/' }, unsubscribeUrl, false);
const welcomeHtmlEs = renderWelcomeEmail(unsubscribeUrl, true);
const welcomeHtmlEn = renderWelcomeEmail(unsubscribeUrl, false);

const outputDir = path.join(process.cwd(), 'scratch/email-previews');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'newsletter-es.html'), newsletterHtmlEs);
fs.writeFileSync(path.join(outputDir, 'newsletter-en.html'), newsletterHtmlEn);
fs.writeFileSync(path.join(outputDir, 'welcome-es.html'), welcomeHtmlEs);
fs.writeFileSync(path.join(outputDir, 'welcome-en.html'), welcomeHtmlEn);

console.log('✅ Email previews generated successfully in scratch/email-previews/');
