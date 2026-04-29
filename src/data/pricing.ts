/**
 * Single source of truth for all pricing displayed on the site.
 *
 * USD is the only currency now (EN / UK / RU). The locale → currency switch
 * is kept for forward-compatibility but currently maps every supported
 * locale to USD.
 *
 * Numbers are intentionally NOT round (e.g. $1,495 not $1,500) — proven
 * conversion lift from price-point psychology.
 *
 * Update prices here and they propagate to:
 *  - /services/* pages and the /services/ hub
 *  - Pricing schema (JSON-LD Offers)
 *  - Compare-to block
 */

import type { Language } from '@/i18n/utils';

export type Currency = 'USD' | 'EUR';

export interface PriceFromOnly {
  from: number;
  weeks?: string;
  currency: Currency;
}

export interface PriceMonthly {
  perMonth: number;
  currency: Currency;
}

export interface PriceOneTime {
  oneTime: number;
  currency: Currency;
}

export interface PriceWithSetup {
  setup: number;
  perMonth: number;
  currency: Currency;
}

// =============================================================================
// PRICING TABLE — USD master. Conversion to EUR is computed at render time.
// =============================================================================

export const PRICING = {
  websiteDevelopment: {
    landing:           { from:   600, weeks: '1-2', currency: 'USD' as const },
    smallBusiness:     { from: 1495,  weeks: '2-4', currency: 'USD' as const },
    multilingual:      { from: 2990,  weeks: '4-6', currency: 'USD' as const },
    ecommerceShopify:  { from: 2495,  weeks: '4-6', currency: 'USD' as const },
    ecommerceCustom:   { from: 3990,  weeks: '6-8', currency: 'USD' as const },
    saas:              { from: 7990,  weeks: '8+',  currency: 'USD' as const },
  },
  webDesign: {
    landing:      { from:  395, weeks: '1',   currency: 'USD' as const },
    multiPage:    { from: 1190, weeks: '2',   currency: 'USD' as const },
    designSystem: { from: 2490, weeks: '2-3', currency: 'USD' as const },
  },
  siteRedesign: {
    visualRefresh: { from:  795, weeks: '2-3', currency: 'USD' as const },
    fullRedesign:  { from: 2490, weeks: '4-6', currency: 'USD' as const },
    migration:     { from: 1495, weeks: '3-4', currency: 'USD' as const },
  },
  siteSupport: {
    basic:  { perMonth:  99, currency: 'USD' as const },
    growth: { perMonth: 249, currency: 'USD' as const },
    pro:    { perMonth: 499, currency: 'USD' as const },
  },
  seo: {
    audit:         { oneTime: 295,  currency: 'USD' as const },
    localSeo:      { perMonth: 395, currency: 'USD' as const },
    fullSeo:       { perMonth: 795, currency: 'USD' as const },
    enterpriseSeo: { perMonth: 1495,currency: 'USD' as const },
  },
  ads: {
    singlePlatform: { setup:  395, perMonth: 295, currency: 'USD' as const },
    multiPlatform:  { setup:  695, perMonth: 495, currency: 'USD' as const },
    fullStack:      { setup: 1190, perMonth: 895, currency: 'USD' as const },
  },
} as const;

// =============================================================================
// HEADLINE STARTING PRICES — used by /services/ hub table.
// Single source of truth, derived from PRICING above.
// =============================================================================

export const SERVICE_STARTING = {
  website_development: PRICING.websiteDevelopment.landing.from,        // 600
  site_design:         PRICING.webDesign.landing.from,                 // 395
  site_redesign:       PRICING.siteRedesign.visualRefresh.from,        // 795
  site_analytics:      PRICING.seo.localSeo.perMonth,                  // 395 /mo
  setting_up_ads:      PRICING.ads.singlePlatform.perMonth,            // 295 /mo
  site_support:        PRICING.siteSupport.basic.perMonth,             //  99 /mo
} as const;

// =============================================================================
// LOCALE → CURRENCY ROUTING
// =============================================================================

// All supported locales (EN / UK / RU) currently use USD. Kept as a Set so
// future EUR/etc. locales can be added without touching call sites.
const EUR_LOCALES: ReadonlySet<Language> = new Set();

/**
 * For a given locale: returns the right currency symbol and amount.
 * Currently always returns USD for the three supported languages.
 */
export function getPriceForLocale(
  amountUsd: number,
  lang: Language,
): { amount: number; currency: Currency; symbol: string } {
  if (EUR_LOCALES.has(lang)) {
    return { amount: amountUsd, currency: 'EUR', symbol: '€' };
  }
  return { amount: amountUsd, currency: 'USD', symbol: '$' };
}

/**
 * Format a price for display: "$1,495", "€1.395".
 */
export function formatPrice(amount: number, currency: Currency, lang: Language): string {
  try {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    const symbol = currency === 'EUR' ? '€' : '$';
    return `${symbol}${amount.toLocaleString('en-US')}`;
  }
}
