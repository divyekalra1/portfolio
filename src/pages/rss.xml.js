import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const items = posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/blog/${post.id}/`,
    }));

  return rss({
    title: 'Divye Kalra',
    description:
      'Security research, homelabs, and engineering notes by Divye Kalra.',
    site: context.site,
    items,
  });
}
