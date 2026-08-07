import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const blog = await getCollection('blog');
  const posts = blog.filter(post => post.id.startsWith('en/'));

  return rss({
    title: 'Kirian Luna Quirós — Blog',
    description: 'Thoughts on software engineering, UX/UI design, and web performance.',
    site: context.site || 'https://kirian.dev',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description,
      link: `/blog/${post.id.replace(/^en\//, '')}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
