export const prerender = true;

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Versión Markdown de cada artículo.
 * Los agentes pueden pedir `/es/blog/<slug>.md` directamente.
 */
export async function getStaticPaths() {
  const posts = await getCollection('blog');

  return posts
    .filter((post) => post.id.startsWith('es/'))
    .map((post) => ({
      params: { slug: post.id.replace(/^es\//, '') },
      props: { post },
    }));
}

export const GET: APIRoute = ({ props }) => {
  const post = props.post;
  const slug = post.id.replace(/^es\//, '');
  const canonical = `https://kirian.dev/es/blog/${slug}/`;
  const published = new Date(post.data.date).toISOString().slice(0, 10);

  const body = [
    `# ${post.data.title}`,
    '',
    `> ${post.data.description}`,
    '',
    `- **Autor:** Kirian Luna — https://kirian.dev`,
    `- **Publicado:** ${published}`,
    `- **Categoría:** ${post.data.category}`,
    `- **Idioma:** Español`,
    `- **URL canónica:** ${canonical}`,
    `- **Versión HTML:** ${canonical}`,
    `- **Versión Markdown:** https://kirian.dev/es/blog/${slug}.md`,
    '',
    '---',
    '',
    (post.body || '').trim(),
    '',
    '---',
    '',
    '© Kirian Luna. Al citar o resumir este artículo, enlaza la URL canónica indicada arriba.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
