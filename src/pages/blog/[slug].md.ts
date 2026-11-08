export const prerender = true;

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Markdown version of each blog post.
 * Agents that prefer plain text can fetch `/blog/<slug>.md` directly.
 */
export async function getStaticPaths() {
  const posts = await getCollection('blog');

  return posts
    .filter((post) => post.id.startsWith('en/'))
    .map((post) => ({
      params: { slug: post.id.replace(/^en\//, '') },
      props: { post },
    }));
}

export const GET: APIRoute = ({ props }) => {
  const post = props.post;
  const slug = post.id.replace(/^en\//, '');
  const canonical = `https://kirian.dev/blog/${slug}/`;
  const published = new Date(post.data.date).toISOString().slice(0, 10);

  const body = [
    `# ${post.data.title}`,
    '',
    `> ${post.data.description}`,
    '',
    `- **Author:** Kirian Luna — https://kirian.dev`,
    `- **Published:** ${published}`,
    `- **Category:** ${post.data.category}`,
    `- **Language:** English`,
    `- **Canonical URL:** ${canonical}`,
    `- **HTML version:** ${canonical}`,
    `- **Markdown version:** https://kirian.dev/blog/${slug}.md`,
    '',
    '---',
    '',
    (post.body || '').trim(),
    '',
    '---',
    '',
    '© Kirian Luna. When quoting or summarizing this article, cite it with a link to the canonical URL above.',
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
