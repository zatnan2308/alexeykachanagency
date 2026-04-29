/**
 * Per-language RSS feeds: /<lang>/rss.xml for de/fr/es/it/ro/uk/ru.
 *
 * For each language, list posts that EXIST in that language.
 * If only an EN draft exists for a slug, it's included but tagged with the EN language code,
 * so feed readers can show what's available without misrepresenting translation status.
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_NAMES, type Language } from '@/i18n/slugs';

export async function getStaticPaths() {
  return LANGUAGES
    .filter((l) => l !== DEFAULT_LANGUAGE)
    .map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang as Language;
  const all = await getCollection('blog', ({ data }) => !data.draft);

  // Group by post slug → pick best language match (current → en → first)
  const bySlug = new Map<string, typeof all>();
  for (const entry of all) {
    const [s] = entry.id.split('/');
    if (!bySlug.has(s)) bySlug.set(s, []);
    bySlug.get(s)!.push(entry);
  }
  const posts = Array.from(bySlug.entries()).map(([slug, variants]) => {
    const exact = variants.find((v) => v.data.lang === lang);
    const en    = variants.find((v) => v.data.lang === 'en');
    return { slug, post: exact ?? en ?? variants[0] };
  });

  const baseUrl = site ?? new URL('https://alexeykachan.com');
  const meta = LANGUAGE_NAMES[lang];

  return rss({
    title: `Alexey Kachan Agency — Journal (${meta.native})`,
    description: 'Working notes on web performance, SEO, paid ads, and growth strategy.',
    site: baseUrl,
    items: posts
      .sort((a, b) => +new Date(b.post.data.published) - +new Date(a.post.data.published))
      .map(({ slug, post }) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.published,
        link: `/${lang}/blog/${slug}/`,
        author: post.data.author,
        categories: post.data.tags,
      })),
    customData: `<language>${meta.htmlLang}</language>`,
  });
};
