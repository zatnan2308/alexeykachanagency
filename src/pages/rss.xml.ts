/**
 * RSS feed for the blog (EN posts).
 * URL: /rss.xml
 *
 * For per-language feeds, add /<lang>/rss.xml.ts later.
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog', ({ data }) => data.lang === 'en' && !data.draft);

  return rss({
    title: 'Alexey Kachan Agency — Journal',
    description: "Working notes on web performance, SEO, paid ads, and growth strategy. Short essays from real client audits — no fluff, no buzzwords.",
    site: context.site ?? 'https://alexeykachan.com',
    items: posts
      .sort((a, b) => +new Date(b.data.published) - +new Date(a.data.published))
      .map((post) => {
        const [slug] = post.id.split('/');
        return {
          title: post.data.title,
          description: post.data.description,
          pubDate: post.data.published,
          link: `/blog/${slug}/`,
          author: post.data.author,
          categories: post.data.tags,
        };
      }),
    customData: '<language>en-us</language>',
  });
};
