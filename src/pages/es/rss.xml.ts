import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const blog = await getCollection('blog');
  const posts = blog.filter(post => post.id.startsWith('es/'));

  return rss({
    title: 'Kirian Luna — Blog (Español)',
    description: 'Pensamientos sobre ingeniería de software, diseño UX/UI y rendimiento web.',
    site: context.site || 'https://kirian.dev',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description,
      link: `/es/blog/${post.id.replace(/^es\//, '')}/`,
    })),
    customData: `<language>es</language>`,
  });
}
