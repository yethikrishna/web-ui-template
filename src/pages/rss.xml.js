import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

/**
 * RSS feed endpoint for the varsha blog.
 *
 * Fetches all published (non-draft) blog posts, sorts them by date in
 * descending order (newest first), and serializes them as an RSS 2.0 feed.
 *
 * The site URL resolves from `context.site`, which is configured in
 * `astro.config.mjs` as `https://myndlabs.tech`.
 */
export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'varsha Blog',
    description: 'News and updates from varsha.',
    site: context.site ?? 'https://myndlabs.tech',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id.replace(/\.(md|mdx)$/i, '')}/`,
    })),
  });
}
