import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
  const blog = await getCollection('blog').then((collection) =>
    collection.sort((a, b) => b.id.localeCompare(a.id))
  );
  return rss({
    title: 'Troubles Factory Cases',
    description: 'Notes, fixes, and updates from Troubles Factory',
    stylesheet: false,
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/cases/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
    canonicalUrl: context.site,
  });
}
