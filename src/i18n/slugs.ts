/**
 * URL Slug Map for Multilingual Routing
 * Alexey Kachan Agency — 3 languages (EN / UK / RU)
 *
 * Strategy: localized slugs for better local SEO performance.
 * Source language = English (canonical key).
 * All other languages have translated slugs based on common search queries
 * in each market (not literal translations).
 *
 * IMPORTANT NOTES:
 * - Slugs use kebab-case (web-development, not web_development)
 * - All slugs in lowercase, ASCII only (no accents in URLs)
 * - Single-word slugs preferred where natural (e.g., "blog", "kontakt")
 * - Service slugs reflect actual search queries in each market
 * - Ukrainian and Russian use Latin transliteration (NOT Cyrillic) —
 *   this is the modern standard, better for sharing and SEO
 *
 * USAGE:
 *   import { slugs, getLocalizedPath, getAlternates } from '@/i18n/slugs';
 *   const path = getLocalizedPath('services.website-development', 'uk');
 *   // Returns: '/uk/poslugy/rozrobka-saytiv/'
 */

// =============================================================================
// SUPPORTED LANGUAGES
// =============================================================================

export const LANGUAGES = ['en', 'uk', 'ru'] as const;
export type Language = typeof LANGUAGES[number];

export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGE_NAMES: Record<Language, { native: string; english: string; flag: string; locale: string; htmlLang: string; ogLocale: string }> = {
  en: { native: 'English',     english: 'English',    flag: '🇬🇧', locale: 'en-US', htmlLang: 'en', ogLocale: 'en_US' },
  uk: { native: 'Українська',  english: 'Ukrainian',  flag: '🇺🇦', locale: 'uk-UA', htmlLang: 'uk', ogLocale: 'uk_UA' },
  ru: { native: 'Русский',     english: 'Russian',    flag: '🌐', locale: 'ru-RU', htmlLang: 'ru', ogLocale: 'ru_RU' },
};

// =============================================================================
// SECTION SLUGS (path segments)
// These are the "folder names" — services/, blog/, cases/, etc.
// =============================================================================

export const sectionSlugs: Record<string, Record<Language, string>> = {
  // Top-level sections
  services: {
    en: 'services',
    uk: 'poslugy',
    ru: 'uslugi',
  },
  cases: {
    en: 'cases',
    uk: 'proekty',
    ru: 'proekty',
  },
  blog: {
    en: 'blog',
    uk: 'blog',
    ru: 'blog',
  },
  blogTag: {
    // Used as: /blog/tag/[tag] — the "tag" segment
    en: 'tag',
    uk: 'temy',
    ru: 'tema',
  },
};

// =============================================================================
// PAGE SLUGS (full path keys)
// Key format: dot-separated logical name (e.g., "services.website-development")
// Value: per-language path WITHOUT leading or trailing slashes,
//        WITHOUT language prefix (that's added by getLocalizedPath)
// =============================================================================

export const slugs: Record<string, Record<Language, string>> = {
  // ---------------------------------------------------------------------------
  // ROOT / HOMEPAGE
  // ---------------------------------------------------------------------------
  'home': {
    en: '',
    uk: '',
    ru: '',
  },

  // ---------------------------------------------------------------------------
  // SERVICES HUB
  // ---------------------------------------------------------------------------
  'services': {
    en: 'services',
    uk: 'poslugy',
    ru: 'uslugi',
  },

  // ---------------------------------------------------------------------------
  // INDIVIDUAL SERVICES (7 services)
  // Each slug uses the most-searched local term per Google Keyword Planner
  // ---------------------------------------------------------------------------
  'services.website-development': {
    en: 'services/website-development',
    uk: 'poslugy/rozrobka-saytiv',                          // "розробка сайтів"
    ru: 'uslugi/razrabotka-saytov',                         // "разработка сайтов"
  },

  'services.mobile-app-development': {
    en: 'services/mobile-app-development',
    uk: 'poslugy/rozrobka-mobilnyh-zastosunkiv',            // "розробка мобільних застосунків"
    ru: 'uslugi/razrabotka-mobilnyh-prilozheniy',           // "разработка мобильных приложений"
  },

  'services.site-redesign': {
    en: 'services/site-redesign',
    uk: 'poslugy/redyzayn-saytu',                           // "редизайн сайту"
    ru: 'uslugi/redizayn-sayta',                            // "редизайн сайта"
  },

  'services.site-support': {
    en: 'services/site-support',
    uk: 'poslugy/pidtrymka-saytu',                          // "підтримка сайту"
    ru: 'uslugi/podderzhka-sayta',                          // "поддержка сайта"
  },

  'services.setting-up-ads': {
    en: 'services/setting-up-ads',
    uk: 'poslugy/nalashtuvannya-reklamy',                   // "налаштування реклами"
    ru: 'uslugi/nastroyka-reklamy',                         // "настройка рекламы"
  },

  'services.site-analytics': {
    // Note: this is the SEO service (per current site, despite the URL name)
    en: 'services/site-analytics',                          // KEEP for SEO equity from old site
    uk: 'poslugy/seo-prosuvannya',                          // "SEO просування"
    ru: 'uslugi/seo-prodvizhenie',                          // "SEO продвижение"
  },

  'services.site-design': {
    en: 'services/site-design',
    uk: 'poslugy/dyzayn-saytiv',                            // "дизайн сайтів"
    ru: 'uslugi/dizayn-saytov',                             // "дизайн сайтов"
  },

  // ---------------------------------------------------------------------------
  // CASES (2 hub pages + dynamic slug)
  // ---------------------------------------------------------------------------
  'cases.web-development': {
    en: 'web-development-cases',                            // KEEP for SEO equity
    uk: 'proekty/rozrobka-saytiv',
    ru: 'proekty/razrabotka-saytov',
  },

  'cases.marketing': {
    en: 'case-studies-marketing',                           // KEEP for SEO equity
    uk: 'proekty/marketing',
    ru: 'proekty/marketing',
  },

  // Dynamic case detail page: /cases/[slug] — section prefix only
  // The actual [slug] comes from content collection frontmatter per locale
  'cases.detail.prefix': {
    en: 'cases',
    uk: 'proekty',
    ru: 'proekty',
  },

  // ---------------------------------------------------------------------------
  // BLOG
  // ---------------------------------------------------------------------------
  'blog': {
    en: 'blog',
    uk: 'blog',
    ru: 'blog',
  },

  // Dynamic blog post: /blog/[slug] — section prefix only
  'blog.detail.prefix': {
    en: 'blog',
    uk: 'blog',
    ru: 'blog',
  },

  // Blog tag pages: /blog/tag/[tag]
  'blog.tag.prefix': {
    en: 'blog/tag',
    uk: 'blog/temy',
    ru: 'blog/tema',
  },

  // ---------------------------------------------------------------------------
  // ABOUT
  // ---------------------------------------------------------------------------
  'about': {
    en: 'about',
    uk: 'pro-nas',                                           // "про нас"
    ru: 'o-nas',                                             // "о нас"
  },

  // ---------------------------------------------------------------------------
  // CONTACTS
  // ---------------------------------------------------------------------------
  'contacts': {
    en: 'contacts',                                          // KEEP for SEO equity (was /contacts-2/, redirecting)
    uk: 'kontakty',
    ru: 'kontakty',
  },

  // ---------------------------------------------------------------------------
  // BRIEF FORMS
  // ---------------------------------------------------------------------------
  'brief.website': {
    en: 'brief-website',                                     // (was /brif-na-razrabotku-sajta/, redirecting)
    uk: 'bryf-na-sayt',
    ru: 'brif-na-sayt',
  },

  'brief.ads': {
    en: 'brief-ads',                                         // (was /brif-na-reklamu/, redirecting)
    uk: 'bryf-na-reklamu',
    ru: 'brif-na-reklamu',
  },

  // ---------------------------------------------------------------------------
  // LEGAL & UTILITY PAGES
  // ---------------------------------------------------------------------------
  'privacy-policy': {
    en: 'privacy-policy',
    uk: 'polityka-konfidentsiynosti',                        // "політика конфіденційності"
    ru: 'politika-konfidentsialnosti',                       // "политика конфиденциальности"
  },

  'cookie-policy': {
    en: 'cookie-policy',
    uk: 'polityka-cookies',
    ru: 'politika-cookies',
  },

  'terms': {
    en: 'terms',
    uk: 'umovy-vykorystannya',                               // "умови використання"
    ru: 'usloviya-ispolzovaniya',                            // "условия использования"
  },

  // ---------------------------------------------------------------------------
  // SITEMAP (HTML version, for users)
  // ---------------------------------------------------------------------------
  'sitemap': {
    en: 'sitemap',
    uk: 'karta-saytu',
    ru: 'karta-sayta',
  },

  // ---------------------------------------------------------------------------
  // 404 (handled by framework, but kept here for completeness)
  // ---------------------------------------------------------------------------
  '404': {
    en: '404',
    uk: '404',
    ru: '404',
  },

  // ---------------------------------------------------------------------------
  // SEARCH (optional, if you add Pagefind static search)
  // ---------------------------------------------------------------------------
  'search': {
    en: 'search',
    uk: 'poshuk',
    ru: 'poisk',
  },

  // ---------------------------------------------------------------------------
  // THANK-YOU PAGES (noindex, after form submit)
  // ---------------------------------------------------------------------------
  'thank-you': {
    en: 'thank-you',
    uk: 'dyakuemo',
    ru: 'spasibo',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get localized path for a page key.
 * Returns full path WITH leading and trailing slash, INCLUDING language prefix.
 *
 * @example
 *   getLocalizedPath('services.website-development', 'de')
 *   // Returns: '/de/dienstleistungen/webentwicklung/'
 *
 *   getLocalizedPath('home', 'fr')
 *   // Returns: '/fr/'
 *
 *   getLocalizedPath('home', 'en')
 *   // Returns: '/'
 */
export function getLocalizedPath(pageKey: string, lang: Language): string {
  const pageSlugs = slugs[pageKey];

  if (!pageSlugs) {
    console.warn(`[i18n/slugs] Unknown page key: "${pageKey}"`);
    return lang === DEFAULT_LANGUAGE ? '/' : `/${lang}/`;
  }

  const slug = pageSlugs[lang];

  // Page doesn't exist in this language (e.g., Impressum only in DE)
  if (slug === '' && pageKey !== 'home') {
    return '';
  }

  // Homepage
  if (slug === '' && pageKey === 'home') {
    return lang === DEFAULT_LANGUAGE ? '/' : `/${lang}/`;
  }

  // All other pages
  const langPrefix = lang === DEFAULT_LANGUAGE ? '' : `/${lang}`;
  return `${langPrefix}/${slug}/`;
}

/**
 * Get all language alternates for a given page key.
 * Used for hreflang tags and language switcher.
 *
 * @example
 *   getAlternates('services.website-development')
 *   // Returns:
 *   // [
 *   //   { lang: 'en', path: '/services/website-development/', url: 'https://...' },
 *   //   { lang: 'de', path: '/de/dienstleistungen/webentwicklung/', url: 'https://...' },
 *   //   ...
 *   // ]
 */
export function getAlternates(
  pageKey: string,
  baseUrl: string = 'https://alexeykachan.com'
): Array<{ lang: Language; path: string; url: string; htmlLang: string }> {
  return LANGUAGES
    .map((lang) => {
      const path = getLocalizedPath(pageKey, lang);
      if (!path) return null;
      return {
        lang,
        path,
        url: `${baseUrl}${path}`,
        htmlLang: LANGUAGE_NAMES[lang].htmlLang,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

/**
 * Get language from a URL path.
 *
 * @example
 *   getLangFromUrl(new URL('https://alexeykachan.com/de/dienstleistungen/'))
 *   // Returns: 'de'
 *
 *   getLangFromUrl(new URL('https://alexeykachan.com/services/'))
 *   // Returns: 'en'
 */
export function getLangFromUrl(url: URL): Language {
  const [, firstSegment] = url.pathname.split('/');
  if (LANGUAGES.includes(firstSegment as Language) && firstSegment !== DEFAULT_LANGUAGE) {
    return firstSegment as Language;
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Reverse lookup: find pageKey from a path.
 * Useful for the language switcher to find equivalent page in another language.
 *
 * @example
 *   findPageKeyFromPath('/de/dienstleistungen/webentwicklung/')
 *   // Returns: 'services.website-development'
 */
export function findPageKeyFromPath(path: string): string | null {
  // Strip language prefix
  const cleanPath = path
    .replace(/^\/(de|fr|es|it|ro|uk|ru)\//, '/')
    .replace(/^\/+|\/+$/g, ''); // strip leading/trailing slashes

  // Determine language from original path
  const lang = path.match(/^\/(de|fr|es|it|ro|uk|ru)\//)?.[1] as Language || DEFAULT_LANGUAGE;

  // Empty path = homepage
  if (cleanPath === '') return 'home';

  // Search for matching slug
  for (const [pageKey, slugMap] of Object.entries(slugs)) {
    if (slugMap[lang] === cleanPath) {
      return pageKey;
    }
  }

  return null;
}

/**
 * Get the equivalent URL in another language.
 * Used for the language switcher.
 *
 * @example
 *   getEquivalentUrl('/de/dienstleistungen/webentwicklung/', 'fr')
 *   // Returns: '/fr/services/developpement-web/'
 *
 *   If no equivalent exists (page doesn't exist in target lang),
 *   returns the localized homepage instead.
 */
export function getEquivalentUrl(currentPath: string, targetLang: Language): string {
  const pageKey = findPageKeyFromPath(currentPath);

  if (!pageKey) {
    // Unknown page — fall back to homepage in target language
    return getLocalizedPath('home', targetLang);
  }

  const equivalentPath = getLocalizedPath(pageKey, targetLang);

  // If page doesn't exist in target language, fall back to homepage
  if (!equivalentPath) {
    return getLocalizedPath('home', targetLang);
  }

  return equivalentPath;
}

/**
 * Build complete hreflang map for a given page.
 * Returns array suitable for rendering <link rel="alternate"> tags.
 *
 * @example
 *   getHreflangMap('services.website-development')
 *   // Returns:
 *   // [
 *   //   { hreflang: 'en', href: 'https://alexeykachan.com/services/website-development/' },
 *   //   { hreflang: 'de', href: 'https://alexeykachan.com/de/dienstleistungen/webentwicklung/' },
 *   //   ...
 *   //   { hreflang: 'x-default', href: 'https://alexeykachan.com/services/website-development/' }
 *   // ]
 */
export function getHreflangMap(
  pageKey: string,
  baseUrl: string = 'https://alexeykachan.com'
): Array<{ hreflang: string; href: string }> {
  const alternates = getAlternates(pageKey, baseUrl);

  const map = alternates.map((alt) => ({
    hreflang: alt.htmlLang,
    href: alt.url,
  }));

  // Add x-default pointing to English version
  const defaultUrl = `${baseUrl}${getLocalizedPath(pageKey, DEFAULT_LANGUAGE)}`;
  map.push({ hreflang: 'x-default', href: defaultUrl });

  return map;
}
