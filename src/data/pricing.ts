/**
 * Single source of truth for all pricing displayed on the site.
 *
 * USD is the base currency. For EUR-priced locales (DE/FR/IT/ES/RO) we apply
 * a fixed conversion (~0.92) and round to .95 — see getPriceForLocale().
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

const EUR_LOCALES: ReadonlySet<Language> = new Set(['de', 'fr', 'it', 'es', 'ro']);
const USD_TO_EUR = 0.92;

/**
 * For a given locale: returns the right currency symbol and an amount converted
 * from USD to EUR if that locale prefers EUR. EUR amounts are rounded down
 * to the nearest .95 ending (e.g. 1495 USD → ~1375 EUR → rounded to 1395).
 */
export function getPriceForLocale(
  amountUsd: number,
  lang: Language,
): { amount: number; currency: Currency; symbol: string } {
  if (EUR_LOCALES.has(lang)) {
    const eurAmount = roundToPsychologicalEur(amountUsd * USD_TO_EUR);
    return { amount: eurAmount, currency: 'EUR', symbol: '€' };
  }
  return { amount: amountUsd, currency: 'USD', symbol: '$' };
}

/**
 * Round to the nearest hundred ending in 95 above the converted amount.
 * 1375 → 1395, 545 → 595, 7350 → 7395, 91 → 95.
 */
function roundToPsychologicalEur(amount: number): number {
  if (amount < 100) return Math.max(95, Math.round(amount / 5) * 5);
  // Round UP to next ___95
  const hundreds = Math.floor(amount / 100);
  const inHundred = amount - hundreds * 100;
  if (inHundred <= 95) return hundreds * 100 + 95;
  return (hundreds + 1) * 100 + 95;
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
