// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { EnumChangefreq } from 'sitemap';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// IMPORTANT: keep these in sync with src/i18n/slugs.ts
const SITE_URL = 'https://alexeykachan.com';

const LOCALES = ['en', 'uk', 'ru'];
const DEFAULT_LOCALE = 'en';

/**
 * Reverse map of localized slugs used by the sitemap `serialize()` to attach
 * <xhtml:link> hreflang alternates to every URL that has translations under
 * different paths. Astro's default i18n sitemap can't infer this because our
 * per-language slugs are completely different (e.g. /services/mobile-app-
 * development/ vs /uk/poslugy/rozrobka-mobilnyh-zastosunkiv/).
 *
 * IMPORTANT: keep in sync with src/i18n/slugs.ts. Only top-level page slugs
 * are listed here — case-detail and blog-post URLs reuse a shared prefix
 * scheme and are matched separately below.
 */
/** @type {Record<string, Record<string, string>>} */
const PAGE_SLUGS = {
  home:                              { en: '',                              uk: '',                                      ru: '' },
  services:                          { en: 'services',                      uk: 'poslugy',                               ru: 'uslugi' },
  'services.website-development':    { en: 'services/website-development',  uk: 'poslugy/rozrobka-saytiv',               ru: 'uslugi/razrabotka-saytov' },
  'services.mobile-app-development': { en: 'services/mobile-app-development', uk: 'poslugy/rozrobka-mobilnyh-zastosunkiv', ru: 'uslugi/razrabotka-mobilnyh-prilozheniy' },
  'services.site-redesign':          { en: 'services/site-redesign',        uk: 'poslugy/redyzayn-saytu',                ru: 'uslugi/redizayn-sayta' },
  'services.site-support':           { en: 'services/site-support',         uk: 'poslugy/pidtrymka-saytu',               ru: 'uslugi/podderzhka-sayta' },
  'services.setting-up-ads':         { en: 'services/setting-up-ads',       uk: 'poslugy/nalashtuvannya-reklamy',        ru: 'uslugi/nastroyka-reklamy' },
  'services.site-analytics':         { en: 'services/site-analytics',       uk: 'poslugy/seo-prosuvannya',               ru: 'uslugi/seo-prodvizhenie' },
  'services.site-design':            { en: 'services/site-design',          uk: 'poslugy/dyzayn-saytiv',                 ru: 'uslugi/dizayn-saytov' },
  'cases.web-development':           { en: 'web-development-cases',         uk: 'proekty/rozrobka-saytiv',               ru: 'proekty/razrabotka-saytov' },
  'cases.marketing':                 { en: 'case-studies-marketing',        uk: 'proekty/marketing',                     ru: 'proekty/marketing' },
  blog:                              { en: 'blog',                          uk: 'blog',                                  ru: 'blog' },
  about:                             { en: 'about',                         uk: 'pro-nas',                               ru: 'o-nas' },
  contacts:                          { en: 'contacts',                      uk: 'kontakty',                              ru: 'kontakty' },
  'privacy-policy':                  { en: 'privacy-policy',                uk: 'polityka-konfidentsiynosti',            ru: 'politika-konfidentsialnosti' },
  'cookie-policy':                   { en: 'cookie-policy',                 uk: 'polityka-cookies',                      ru: 'politika-cookies' },
  terms:                             { en: 'terms',                         uk: 'umovy-vykorystannya',                   ru: 'usloviya-ispolzovaniya' },
};

// Prefix for /cases/<slug>/ pages — they share one slug across all languages,
// only the section prefix differs.
/** @type {Record<string, string>} */
const CASES_DETAIL_PREFIX = { en: 'cases', uk: 'proekty', ru: 'proekty' };

/**
 * URL → page path (without language prefix and trailing slash).
 * @param {string} url
 */
function stripLocaleAndSlash(url) {
  const m = url.replace(SITE_URL, '').replace(/\/$/, '');
  const parts = m.replace(/^\//, '').split('/');
  if (parts[0] === 'uk' || parts[0] === 'ru') {
    return { locale: parts[0], path: parts.slice(1).join('/') };
  }
  return { locale: 'en', path: parts.join('/') };
}

/**
 * Find which page-key a given URL corresponds to (or null).
 * @param {{ locale: string; path: string }} localePath
 */
function reversePageKey(localePath) {
  const { locale, path } = localePath;
  // Case-detail: <prefix>/<slug>
  const casePrefix = CASES_DETAIL_PREFIX[locale];
  if (path.startsWith(`${casePrefix}/`)) {
    const slug = path.slice(casePrefix.length + 1);
    return { kind: 'case', slug };
  }
  // Blog-post: blog/<slug>
  if (path.startsWith('blog/') && !path.startsWith('blog/tag/')) {
    const slug = path.slice('blog/'.length);
    return { kind: 'blog-post', slug };
  }
  // Static page — look up by exact slug match for that locale
  for (const [key, slugsForKey] of Object.entries(PAGE_SLUGS)) {
    if (slugsForKey[locale] === path) return { kind: 'page', pageKey: key };
  }
  return null;
}

/**
 * Build absolute URL for (pageKey | case slug | blog slug) in a target locale.
 * @param {{ kind: string; pageKey?: string; slug?: string }} found
 * @param {string} targetLocale
 */
function buildLocalizedUrl(found, targetLocale) {
  if (found.kind === 'case') {
    const prefix = CASES_DETAIL_PREFIX[targetLocale];
    const langPrefix = targetLocale === DEFAULT_LOCALE ? '' : `/${targetLocale}`;
    return `${SITE_URL}${langPrefix}/${prefix}/${found.slug}/`;
  }
  if (found.kind === 'blog-post') {
    const langPrefix = targetLocale === DEFAULT_LOCALE ? '' : `/${targetLocale}`;
    return `${SITE_URL}${langPrefix}/blog/${found.slug}/`;
  }
  const slugs = found.pageKey ? PAGE_SLUGS[found.pageKey] : undefined;
  if (!slugs) return null;
  const langPrefix = targetLocale === DEFAULT_LOCALE ? '' : `/${targetLocale}`;
  const slug = slugs[targetLocale];
  return slug ? `${SITE_URL}${langPrefix}/${slug}/` : `${SITE_URL}${langPrefix}/`;
}

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  output: 'static',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: LOCALES,
    routing: {
      // English at root (no /en/ prefix), all other languages prefixed
      prefixDefaultLocale: false,
      // Don't auto-redirect — Google needs to crawl all versions
      redirectToDefaultLocale: false,
    },
    // Don't auto-fallback — we manage fallbacks manually for SEO clarity
    fallback: {},
  },
  integrations: [
    react({
      // Only hydrate React on islands that explicitly need it
      include: ['**/components/interactive/**'],
    }),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: { theme: 'github-dark-dimmed' },
      gfm: true,
    }),
    sitemap({
      // hreflang is built manually inside serialize() — Astro's auto-i18n
      // can't pair our differently-slugged localized URLs.
      filter: (page) => {
        // Exclude noindex / conversion / utility pages from the sitemap.
        const excludePatterns = [
          '/thank-you/',
          '/dyakuemo/',
          '/spasibo/',
          '/404/',
          '/admin/',
          '/draft/',
          '/sitemap/',           // HTML sitemap is for humans, not crawlers
          // Brief / conversion pages — noindex, shouldn't be crawled either
          '/brief-ads/',
          '/brief-website/',
          '/brif-na-',           // RU brief slugs (Cyrillic transliterated)
          '/bryf-na-',           // UK brief slugs (Cyrillic transliterated)
        ];
        return !excludePatterns.some((p) => page.includes(p));
      },
      changefreq: EnumChangefreq.WEEKLY,
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // 1. Boost priority for key pages.
        if (item.url === `${SITE_URL}/`) {
          item.priority = 1.0;
          item.changefreq = EnumChangefreq.DAILY;
        } else if (item.url.match(/\/(services|poslugy|uslugi)\/$/)) {
          item.priority = 0.9;
          item.changefreq = EnumChangefreq.MONTHLY;
        } else if (item.url.includes('/blog/')) {
          item.priority = 0.7;
          item.changefreq = EnumChangefreq.WEEKLY;
        } else if (
          item.url.includes('/privacy') ||
          item.url.includes('/terms') ||
          item.url.includes('/cookie')
        ) {
          item.priority = 0.3;
          item.changefreq = EnumChangefreq.YEARLY;
        }

        // 2. Attach <xhtml:link> hreflang alternates by reverse-lookup of
        //    the URL against our localized slug map.
        const localePath = stripLocaleAndSlash(item.url);
        const found = reversePageKey(localePath);
        if (found) {
          const links = [];
          for (const lang of LOCALES) {
            const href = buildLocalizedUrl(found, lang);
            if (href) links.push({ url: href, lang });
          }
          if (links.length > 1) {
            item.links = links;
          }
        }
        return item;
      },
    }),
    partytown({
      // Run analytics in a Web Worker for performance
      config: {
        forward: ['dataLayer.push', 'gtag', 'fbq', 'clarity'],
        debug: false,
      },
    }),
  ],
  vite: {
    // tailwindcss() Vite plugin types differ across vite copies — cast to any
    plugins: [/** @type {any} */ (tailwindcss())],
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          // Hash assets for long-term caching
          assetFileNames: '_assets/[name]-[hash][extname]',
          chunkFileNames: '_assets/[name]-[hash].js',
          entryFileNames: '_assets/[name]-[hash].js',
        },
      },
    },
    ssr: {
      // Avoid bundling certain heavy libs
      noExternal: ['gsap'],
    },
  },
  image: {
    // Use Sharp for image optimization (default in Astro 5).
    // Note: per-format selection (avif/webp) is set on each <Image format="..." /> usage
    // or via the image service config — there is no top-level `formats` field in Astro 5.
    domains: ['alexeykachan.com', 'www.alexeykachan.com'],
  },
  experimental: {
    clientPrerender: true,
  },
});
