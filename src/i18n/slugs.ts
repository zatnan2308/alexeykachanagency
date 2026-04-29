/**
 * URL Slug Map for Multilingual Routing
 * Alexey Kachan Agency — 8 languages
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
 *   const path = getLocalizedPath('services.website-development', 'de');
 *   // Returns: '/de/dienstleistungen/website-entwicklung/'
 */

// =============================================================================
// SUPPORTED LANGUAGES
// =============================================================================

export const LANGUAGES = ['en', 'de', 'fr', 'es', 'it', 'ro', 'uk', 'ru'] as const;
export type Language = typeof LANGUAGES[number];

export const DEFAULT_LANGUAGE: Language = 'en';

export const LANGUAGE_NAMES: Record<Language, { native: string; english: string; flag: string; locale: string; htmlLang: string; ogLocale: string }> = {
  en: { native: 'English',     english: 'English',    flag: '🇬🇧', locale: 'en-US', htmlLang: 'en', ogLocale: 'en_US' },
  de: { native: 'Deutsch',     english: 'German',     flag: '🇩🇪', locale: 'de-DE', htmlLang: 'de', ogLocale: 'de_DE' },
  fr: { native: 'Français',    english: 'French',     flag: '🇫🇷', locale: 'fr-FR', htmlLang: 'fr', ogLocale: 'fr_FR' },
  es: { native: 'Español',     english: 'Spanish',    flag: '🇪🇸', locale: 'es-ES', htmlLang: 'es', ogLocale: 'es_ES' },
  it: { native: 'Italiano',    english: 'Italian',    flag: '🇮🇹', locale: 'it-IT', htmlLang: 'it', ogLocale: 'it_IT' },
  ro: { native: 'Română',      english: 'Romanian',   flag: '🇷🇴', locale: 'ro-RO', htmlLang: 'ro', ogLocale: 'ro_RO' },
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
    de: 'dienstleistungen',
    fr: 'services',
    es: 'servicios',
    it: 'servizi',
    ro: 'servicii',
    uk: 'poslugy',
    ru: 'uslugi',
  },
  cases: {
    en: 'cases',
    de: 'projekte',
    fr: 'projets',
    es: 'proyectos',
    it: 'progetti',
    ro: 'proiecte',
    uk: 'proekty',
    ru: 'proekty',
  },
  blog: {
    en: 'blog',
    de: 'blog',
    fr: 'blog',
    es: 'blog',
    it: 'blog',
    ro: 'blog',
    uk: 'blog',
    ru: 'blog',
  },
  blogTag: {
    // Used as: /blog/tag/[tag] — the "tag" segment
    en: 'tag',
    de: 'thema',
    fr: 'sujet',
    es: 'tema',
    it: 'argomento',
    ro: 'subiect',
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
    de: '',
    fr: '',
    es: '',
    it: '',
    ro: '',
    uk: '',
    ru: '',
  },

  // ---------------------------------------------------------------------------
  // SERVICES HUB
  // ---------------------------------------------------------------------------
  'services': {
    en: 'services',
    de: 'dienstleistungen',
    fr: 'services',
    es: 'servicios',
    it: 'servizi',
    ro: 'servicii',
    uk: 'poslugy',
    ru: 'uslugi',
  },

  // ---------------------------------------------------------------------------
  // INDIVIDUAL SERVICES (6 services)
  // Each slug uses the most-searched local term per Google Keyword Planner
  // ---------------------------------------------------------------------------
  'services.website-development': {
    en: 'services/website-development',
    de: 'dienstleistungen/webentwicklung',                  // "Webentwicklung" — main DE term
    fr: 'services/developpement-web',                       // "développement web" — most searched
    es: 'servicios/desarrollo-web',                         // "desarrollo web" — top query
    it: 'servizi/sviluppo-web',                             // "sviluppo web"
    ro: 'servicii/dezvoltare-web',                          // "dezvoltare web"
    uk: 'poslugy/rozrobka-saytiv',                          // "розробка сайтів"
    ru: 'uslugi/razrabotka-saytov',                         // "разработка сайтов"
  },

  'services.site-redesign': {
    en: 'services/site-redesign',
    de: 'dienstleistungen/website-redesign',                // German keeps "Redesign"
    fr: 'services/refonte-site-web',                        // "refonte de site" — standard FR term
    es: 'servicios/rediseno-web',                           // "rediseño web"
    it: 'servizi/restyling-sito-web',                       // "restyling sito"
    ro: 'servicii/redesign-site',                           // "redesign site"
    uk: 'poslugy/redyzayn-saytu',                           // "редизайн сайту"
    ru: 'uslugi/redizayn-sayta',                            // "редизайн сайта"
  },

  'services.site-support': {
    en: 'services/site-support',
    de: 'dienstleistungen/website-wartung',                 // "Website-Wartung" — top DE term
    fr: 'services/maintenance-site-web',                    // "maintenance de site"
    es: 'servicios/mantenimiento-web',                      // "mantenimiento web"
    it: 'servizi/manutenzione-sito-web',                    // "manutenzione sito"
    ro: 'servicii/mentenanta-site',                         // "mentenanță site"
    uk: 'poslugy/pidtrymka-saytu',                          // "підтримка сайту"
    ru: 'uslugi/podderzhka-sayta',                          // "поддержка сайта"
  },

  'services.setting-up-ads': {
    en: 'services/setting-up-ads',
    de: 'dienstleistungen/google-ads-meta-ads',             // SEO-friendly: combines top brands
    fr: 'services/publicite-en-ligne',                      // "publicité en ligne" — generic top term
    es: 'servicios/publicidad-online',                      // "publicidad online"
    it: 'servizi/pubblicita-online',                        // "pubblicità online"
    ro: 'servicii/publicitate-online',                      // "publicitate online"
    uk: 'poslugy/nalashtuvannya-reklamy',                   // "налаштування реклами"
    ru: 'uslugi/nastroyka-reklamy',                         // "настройка рекламы"
  },

  'services.site-analytics': {
    // Note: this is the SEO service (per current site, despite the URL name)
    en: 'services/site-analytics',                          // KEEP for SEO equity from old site
    de: 'dienstleistungen/seo-optimierung',                 // "SEO-Optimierung" — top DE term
    fr: 'services/referencement-seo',                       // "référencement SEO" / "référencement naturel"
    es: 'servicios/posicionamiento-seo',                    // "posicionamiento SEO"
    it: 'servizi/posizionamento-seo',                       // "posizionamento SEO"
    ro: 'servicii/optimizare-seo',                          // "optimizare SEO"
    uk: 'poslugy/seo-prosuvannya',                          // "SEO просування"
    ru: 'uslugi/seo-prodvizhenie',                          // "SEO продвижение"
  },

  'services.site-design': {
    en: 'services/site-design',
    de: 'dienstleistungen/webdesign',                       // "Webdesign" — single word, top DE
    fr: 'services/design-web',                              // "design web" or "création graphique"
    es: 'servicios/diseno-web',                             // "diseño web"
    it: 'servizi/web-design',                               // English term widely used in IT
    ro: 'servicii/design-web',                              // "design web"
    uk: 'poslugy/dyzayn-saytiv',                            // "дизайн сайтів"
    ru: 'uslugi/dizayn-saytov',                             // "дизайн сайтов"
  },

  // ---------------------------------------------------------------------------
  // CASES (2 hub pages + dynamic slug)
  // ---------------------------------------------------------------------------
  'cases.web-development': {
    en: 'web-development-cases',                            // KEEP for SEO equity
    de: 'projekte/webentwicklung',
    fr: 'projets/developpement-web',
    es: 'proyectos/desarrollo-web',
    it: 'progetti/sviluppo-web',
    ro: 'proiecte/dezvoltare-web',
    uk: 'proekty/rozrobka-saytiv',
    ru: 'proekty/razrabotka-saytov',
  },

  'cases.marketing': {
    en: 'case-studies-marketing',                           // KEEP for SEO equity
    de: 'projekte/marketing',
    fr: 'projets/marketing',
    es: 'proyectos/marketing',
    it: 'progetti/marketing',
    ro: 'proiecte/marketing',
    uk: 'proekty/marketing',
    ru: 'proekty/marketing',
  },

  // Dynamic case detail page: /cases/[slug] — section prefix only
  // The actual [slug] comes from content collection frontmatter per locale
  'cases.detail.prefix': {
    en: 'cases',
    de: 'projekte',
    fr: 'projets',
    es: 'proyectos',
    it: 'progetti',
    ro: 'proiecte',
    uk: 'proekty',
    ru: 'proekty',
  },

  // ---------------------------------------------------------------------------
  // BLOG
  // ---------------------------------------------------------------------------
  'blog': {
    en: 'blog',
    de: 'blog',
    fr: 'blog',
    es: 'blog',
    it: 'blog',
    ro: 'blog',
    uk: 'blog',
    ru: 'blog',
  },

  // Dynamic blog post: /blog/[slug] — section prefix only
  'blog.detail.prefix': {
    en: 'blog',
    de: 'blog',
    fr: 'blog',
    es: 'blog',
    it: 'blog',
    ro: 'blog',
    uk: 'blog',
    ru: 'blog',
  },

  // Blog tag pages: /blog/tag/[tag]
  'blog.tag.prefix': {
    en: 'blog/tag',
    de: 'blog/thema',
    fr: 'blog/sujet',
    es: 'blog/tema',
    it: 'blog/argomento',
    ro: 'blog/subiect',
    uk: 'blog/temy',
    ru: 'blog/tema',
  },

  // ---------------------------------------------------------------------------
  // ABOUT
  // ---------------------------------------------------------------------------
  'about': {
    en: 'about',
    de: 'ueber-uns',                                         // "über uns" → ASCII "ueber-uns"
    fr: 'a-propos',                                          // "à propos" → ASCII "a-propos"
    es: 'sobre-nosotros',                                    // "sobre nosotros"
    it: 'chi-siamo',                                         // "chi siamo"
    ro: 'despre-noi',                                        // "despre noi"
    uk: 'pro-nas',                                           // "про нас"
    ru: 'o-nas',                                             // "о нас"
  },

  // ---------------------------------------------------------------------------
  // CONTACTS
  // ---------------------------------------------------------------------------
  'contacts': {
    en: 'contacts',                                          // KEEP for SEO equity (was /contacts-2/, redirecting)
    de: 'kontakt',
    fr: 'contact',
    es: 'contacto',
    it: 'contatti',
    ro: 'contact',
    uk: 'kontakty',
    ru: 'kontakty',
  },

  // ---------------------------------------------------------------------------
  // BRIEF FORMS
  // ---------------------------------------------------------------------------
  'brief.website': {
    en: 'brief-website',                                     // (was /brif-na-razrabotku-sajta/, redirecting)
    de: 'briefing-website',
    fr: 'brief-site-web',
    es: 'brief-sitio-web',
    it: 'brief-sito-web',
    ro: 'brief-site-web',
    uk: 'bryf-na-sayt',
    ru: 'brif-na-sayt',
  },

  'brief.ads': {
    en: 'brief-ads',                                         // (was /brif-na-reklamu/, redirecting)
    de: 'briefing-werbung',
    fr: 'brief-publicite',
    es: 'brief-publicidad',
    it: 'brief-pubblicita',
    ro: 'brief-publicitate',
    uk: 'bryf-na-reklamu',
    ru: 'brif-na-reklamu',
  },

  // ---------------------------------------------------------------------------
  // LEGAL & UTILITY PAGES
  // ---------------------------------------------------------------------------
  'privacy-policy': {
    en: 'privacy-policy',
    de: 'datenschutz',                                       // "Datenschutz" — standard DE legal term
    fr: 'politique-confidentialite',                         // "politique de confidentialité"
    es: 'politica-privacidad',                               // "política de privacidad"
    it: 'privacy-policy',                                    // English term widely used in IT
    ro: 'politica-confidentialitate',                        // "politica de confidențialitate"
    uk: 'polityka-konfidentsiynosti',                        // "політика конфіденційності"
    ru: 'politika-konfidentsialnosti',                       // "политика конфиденциальности"
  },

  'cookie-policy': {
    en: 'cookie-policy',
    de: 'cookie-richtlinie',
    fr: 'politique-cookies',
    es: 'politica-cookies',
    it: 'cookie-policy',
    ro: 'politica-cookies',
    uk: 'polityka-cookies',
    ru: 'politika-cookies',
  },

  'terms': {
    en: 'terms',
    de: 'agb',                                               // "AGB" = Allgemeine Geschäftsbedingungen (standard)
    fr: 'mentions-legales',                                  // "mentions légales" — FR equivalent
    es: 'terminos-condiciones',                              // "términos y condiciones"
    it: 'termini-condizioni',                                // "termini e condizioni"
    ro: 'termeni-conditii',                                  // "termeni și condiții"
    uk: 'umovy-vykorystannya',                               // "умови використання"
    ru: 'usloviya-ispolzovaniya',                            // "условия использования"
  },

  // ---------------------------------------------------------------------------
  // GERMAN-ONLY: IMPRESSUM (legally required in DE/AT)
  // For other languages, return null (page doesn't exist there)
  // ---------------------------------------------------------------------------
  'impressum': {
    en: '',                                                   // Not applicable
    de: 'impressum',                                          // Required by Telemediengesetz
    fr: '',
    es: '',
    it: '',
    ro: '',
    uk: '',
    ru: '',
  },

  // ---------------------------------------------------------------------------
  // SITEMAP (HTML version, for users)
  // ---------------------------------------------------------------------------
  'sitemap': {
    en: 'sitemap',
    de: 'sitemap',
    fr: 'plan-du-site',
    es: 'mapa-del-sitio',
    it: 'mappa-del-sito',
    ro: 'harta-site',
    uk: 'karta-saytu',
    ru: 'karta-sayta',
  },

  // ---------------------------------------------------------------------------
  // 404 (handled by framework, but kept here for completeness)
  // ---------------------------------------------------------------------------
  '404': {
    en: '404',
    de: '404',
    fr: '404',
    es: '404',
    it: '404',
    ro: '404',
    uk: '404',
    ru: '404',
  },

  // ---------------------------------------------------------------------------
  // SEARCH (optional, if you add Pagefind static search)
  // ---------------------------------------------------------------------------
  'search': {
    en: 'search',
    de: 'suche',
    fr: 'recherche',
    es: 'buscar',
    it: 'cerca',
    ro: 'cautare',
    uk: 'poshuk',
    ru: 'poisk',
  },

  // ---------------------------------------------------------------------------
  // THANK-YOU PAGES (noindex, after form submit)
  // ---------------------------------------------------------------------------
  'thank-you': {
    en: 'thank-you',
    de: 'danke',
    fr: 'merci',
    es: 'gracias',
    it: 'grazie',
    ro: 'multumim',
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
