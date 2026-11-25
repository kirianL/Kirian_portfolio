import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://kirian.dev',
  adapter: vercel(),
  output: 'server',
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    react(),
    sitemap({
      // Keep error and API routes out of the indexable sitemap.
      filter: (page) => !page.includes('/404') && !page.includes('/api/'),
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
