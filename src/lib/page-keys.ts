/**
 * Shared registry of supported page keys for the catchall routes.
 *
 * Why a separate module: Astro `getStaticPaths()` is hoisted into a separate
 * scope at build time, and **top-level constants from the same .astro file are
 * NOT visible inside it**. Anything `getStaticPaths()` needs must live in an
 * imported module or be declared inside the function itself.
 *
 * To add a new section:
 *   1. Add its pageKey to SUPPORTED_PAGE_KEYS below.
 *   2. Make sure src/i18n/slugs.ts has slug entries for that key in every lang.
 *   3. Add a switch branch + template render in both catchall .astro files.
 */

export const SUPPORTED_PAGE_KEYS = [
  'services',
  'services.website-development',
  'services.mobile-app-development',
  'services.site-design',
  'services.site-redesign',
  'services.site-analytics',
  'services.setting-up-ads',
  'services.site-support',
  'blog',
  'cases.web-development',
  'cases.marketing',
  'about',
  'contacts',
  'brief.website',
  'brief.ads',
  'privacy-policy',
  'cookie-policy',
  'terms',
  'thank-you',
] as const;

export type SupportedPageKey = typeof SUPPORTED_PAGE_KEYS[number];

/**
 * Map from slug pageKey → en.json `services_pages` key (used by ServiceDetail).
 */
export const serviceKeyMap: Record<string, string> = {
  'services.website-development':     'website_development',
  'services.mobile-app-development':  'mobile_app_development',
  'services.site-design':             'site_design',
  'services.site-redesign':           'site_redesign',
  'services.site-analytics':          'site_analytics',
  'services.setting-up-ads':          'setting_up_ads',
  'services.site-support':            'site_support',
};
