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

const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'ro', 'uk', 'ru'];
const DEFAULT_LOCALE = 'en';

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
      // Sitemap with hreflang for all 8 languages
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: {
          en: 'en',
          de: 'de',
          fr: 'fr',
          es: 'es',
          it: 'it',
          ro: 'ro',
          uk: 'uk',
          ru: 'ru',
        },
      },
      filter: (page) => {
        // Exclude noindex pages from sitemap
        const excludePatterns = [
          '/thank-you/',
          '/danke/',
          '/merci/',
          '/gracias/',
          '/grazie/',
          '/multumim/',
          '/dyakuemo/',
          '/spasibo/',
          '/404/',
          '/admin/',
          '/draft/',
        ];
        return !excludePatterns.some((p) => page.includes(p));
      },
      changefreq: EnumChangefreq.WEEKLY,
      priority: 0.7,
      lastmod: new Date(),
      // Custom priority per page type — handled at page level via custom sitemap if needed
      serialize(item) {
        // Boost priority for key pages
        if (item.url === `${SITE_URL}/`) {
          item.priority = 1.0;
          item.changefreq = EnumChangefreq.DAILY;
        } else if (item.url.match(/\/(services|dienstleistungen|servicios|servizi|servicii|poslugy|uslugi)\/$/)) {
          item.priority = 0.9;
          item.changefreq = EnumChangefreq.MONTHLY;
        } else if (item.url.includes('/blog/')) {
          item.priority = 0.7;
          item.changefreq = EnumChangefreq.WEEKLY;
        } else if (
          item.url.includes('/privacy') ||
          item.url.includes('/datenschutz') ||
          item.url.includes('/terms') ||
          item.url.includes('/agb') ||
          item.url.includes('/cookie') ||
          item.url.includes('/impressum')
        ) {
          item.priority = 0.3;
          item.changefreq = EnumChangefreq.YEARLY;
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
