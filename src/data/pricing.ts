/**
 * Pricing — Single Source of Truth.
 *
 * IMPORTANT: All prices on the site must come from this file.
 * Never hardcode prices in components or content files.
 *
 * Currency: USD only — every supported locale (en / uk / ru) renders
 * prices in $. The `Currency` type is kept so future locales (e.g. EUR
 * for European markets) can be added without touching call sites.
 *
 * Numbers are intentionally not round (e.g. $1,195 not $1,200) — proven
 * conversion lift from price-point psychology.
 */

import type { Language } from '@/i18n/utils';

export type Currency = 'USD';
export type Locale = Language;

export interface PriceEntry {
  /** Starting amount in USD. `null` when the tier is "Custom" / quote-only. */
  fromUSD: number | null;
  /** Display label for the tier (English; UI label comes from i18n). */
  label?: string;
  /** Short rationale shown alongside the price. */
  description?: string;
  /** "1-2", "4-6" weeks, etc. Empty when not applicable (e.g. monthly retainer). */
  weeks?: string;
  /** Cadence — `month` for retainers, `one-time` for fixed deliverables. */
  recurring?: 'month' | 'one-time';
  /** Highlighted card on the pricing grid. */
  mostPopular?: boolean;
  /** Suffix appended after the amount when present (e.g. "+ 10% of spend"). */
  customSuffix?: string;
}

// =============================================================================
// PRICING TABLE
// =============================================================================

export const PRICING = {
  // ---------------------------------------------------------------------------
  // WEBSITE DEVELOPMENT
  // ---------------------------------------------------------------------------
  websiteDevelopment: {
    platforms: {
      plainHtml:    { fromUSD:   395, weeks: '1',   label: 'Plain HTML / CSS / JS' },
      wixStudio:    { fromUSD:   555, weeks: '1-2', label: 'Wix Studio' },
      elementor:    { fromUSD:   715, weeks: '1-2', label: 'Elementor (WordPress)' },
      wordpress:    { fromUSD:  1195, weeks: '2-4', label: 'WordPress' },
      astro:        { fromUSD:  1515, weeks: '3-4', label: 'Astro' },
      shopify:      { fromUSD:  1995, weeks: '4-6', label: 'Shopify' },
      headlessCms:  { fromUSD:  3995, weeks: '4-6', label: 'Headless CMS (Sanity / Storyblok / Contentful)' },
      woocommerce:  { fromUSD:  4795, weeks: '6-8', label: 'WooCommerce' },
      nextjs:       { fromUSD: 11995, weeks: '10+', label: 'Next.js' },
      nodejs:       { fromUSD: 11995, weeks: '10+', label: 'Node.js bespoke' },
    } satisfies Record<string, PriceEntry>,

    tiers: {
      landing:     { fromUSD:   395, weeks: '1-2', label: 'Landing & one-pager',
        description: 'Single landing or one-pager. Plain HTML, Wix Studio, or Elementor — chosen for the task.' },
      business:    { fromUSD:  1195, weeks: '2-4', label: 'Business website',  mostPopular: true,
        description: '5–15 pages. WordPress or Astro — chosen by your team needs.' },
      corporate:   { fromUSD:  2795, weeks: '4-6', label: 'Multilingual corporate',
        description: '15+ pages, custom design system, advanced SEO, ready for 2–3 languages from launch.' },
      shopify:     { fromUSD:  1995, weeks: '4-6', label: 'E-commerce (Shopify)',
        description: 'Catalog, cart, checkout, payments. Faster, simpler — but platform-locked.' },
      woocommerce: { fromUSD:  4795, weeks: '6-8', label: 'E-commerce (WooCommerce)',
        description: 'Full ownership, no platform fees, custom checkout — but longer build.' },
      custom:      { fromUSD: 11995, weeks: '10+', label: 'Custom / SaaS',
        description: 'Auth, billing, dashboards, custom logic. Next.js or Node.js. Detailed scope after discovery.' },
    } satisfies Record<string, PriceEntry>,
  },

  // ---------------------------------------------------------------------------
  // SITE REDESIGN — must be ≤ Website Development of the same tier.
  // ---------------------------------------------------------------------------
  siteRedesign: {
    starter: { fromUSD: 1195, weeks: '2-3', label: 'Starter',
      description: 'Up to 15 pages. Single language. Visual refresh + SEO preservation.' },
    growth:  { fromUSD: 2795, weeks: '4-6', label: 'Growth', mostPopular: true,
      description: 'Up to 50 pages, 2–3 languages. Heatmap-driven UX redesign + full migration.' },
    scale:   { fromUSD: null, weeks: '8+',  label: 'Scale',
      description: 'Enterprise migration, 100+ pages, multilingual, custom CMS migration.' },
  } satisfies Record<string, PriceEntry>,

  // ---------------------------------------------------------------------------
  // WEB DESIGN — design-only must be ≤ design+code of the same scope.
  // ---------------------------------------------------------------------------
  webDesign: {
    starter: { fromUSD:  555, weeks: '1-2', label: 'Starter',
      description: 'Single-page redesign or landing page. 1 page, 3 device sizes.' },
    growth:  { fromUSD: 1515, weeks: '3-4', label: 'Growth', mostPopular: true,
      description: 'Up to 8 pages with full design system, interactive prototype, usability test.' },
    scale:   { fromUSD: null, weeks: '6+',  label: 'Scale',
      description: 'Full platform redesign, SaaS product, multi-persona research, design ops setup.' },
  } satisfies Record<string, PriceEntry>,

  // ---------------------------------------------------------------------------
  // PAID ADVERTISING
  // ---------------------------------------------------------------------------
  paidAdvertising: {
    audit:  { fromUSD:  945, weeks: '1', recurring: 'one-time', label: 'Audit',
      description: 'One-off account audit + 30-day recovery plan.' },
    growth: { fromUSD: 1195,              recurring: 'month',    label: 'Growth', mostPopular: true,
      description: 'Single platform (Google or Meta), up to $30k/month managed spend, 4 ads/month.' },
    scale:  { fromUSD: null, customSuffix: '+ 10% of spend', recurring: 'month', label: 'Scale',
      description: 'Multi-platform, $50k+/month spend, server-side tracking, daily check-ins.' },
  } satisfies Record<string, PriceEntry>,

  // ---------------------------------------------------------------------------
  // SEO PROMOTION
  // ---------------------------------------------------------------------------
  seo: {
    audit:  { fromUSD: 395, weeks: '2', recurring: 'one-time', label: 'Audit',
      description: '200-point technical audit, keyword research (50 keywords), 90-day roadmap.' },
    growth: { fromUSD: 715,             recurring: 'month',    label: 'Growth', mostPopular: true,
      description: 'Top 20 pages optimized, 4 articles/month, 4 referring domains/month, monthly reports.' },
    scale:  { fromUSD: null,            recurring: 'month',    label: 'Scale',
      description: 'Top 50 pages, 8 articles/month, 8 referring domains DR50+/month, weekly check-ins.' },
  } satisfies Record<string, PriceEntry>,

  // ---------------------------------------------------------------------------
  // SITE SUPPORT — logical x2.5 progression between tiers.
  // ---------------------------------------------------------------------------
  siteSupport: {
    essentials: { fromUSD:  79, recurring: 'month', label: 'Essentials',
      description: 'Single-language sites under 30 pages. Updates, backups, monitoring, 1h edits/month.' },
    growth:     { fromUSD: 199, recurring: 'month', label: 'Growth', mostPopular: true,
      description: 'Multilingual sites or e-commerce up to 100 pages. Priority response, 4h edits/month.' },
    scale:      { fromUSD: 399, recurring: 'month', label: 'Scale',
      description: 'Mission-critical platforms. 1-hour SLA 24/7, dedicated Slack channel, custom hours.' },
  } satisfies Record<string, PriceEntry>,
} as const;

// =============================================================================
// HEADLINE STARTING PRICES — used by /services/ hub and any "starting at" copy.
// Single source of truth, derived from PRICING above.
// =============================================================================

export const SERVICE_STARTING = {
  website_development: PRICING.websiteDevelopment.tiers.landing.fromUSD,    // 395
  site_design:         PRICING.webDesign.starter.fromUSD,                    // 555
  site_redesign:       PRICING.siteRedesign.starter.fromUSD,                 // 1195
  site_analytics:      PRICING.seo.audit.fromUSD,                            // 395
  setting_up_ads:      PRICING.paidAdvertising.growth.fromUSD,               // 1195 /mo
  site_support:        PRICING.siteSupport.essentials.fromUSD,               //   79 /mo
} as const;

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get a locale-aware { amount, currency, symbol, isCustom } payload.
 * Currently every supported locale uses USD. Returns `isCustom: true`
 * (and `amount: null`) for tiers without a published starting price.
 */
export function getPriceForLocale(
  amountUsd: number | null,
  _lang: Locale,
): { amount: number | null; currency: Currency; symbol: string; isCustom: boolean } {
  if (amountUsd === null) {
    return { amount: null, currency: 'USD', symbol: '$', isCustom: true };
  }
  return { amount: amountUsd, currency: 'USD', symbol: '$', isCustom: false };
}

/**
 * Format a price in locale-specific separators: "$1,195".
 */
export function formatPrice(
  amount: number | null,
  _currency: Currency,
  lang: Locale,
  isCustom = false,
): string {
  if (isCustom || amount === null) {
    const customLabels: Record<Locale, string> = {
      en: 'Custom',
      uk: 'Індивідуально',
      ru: 'Индивидуально',
    };
    return customLabels[lang] ?? customLabels.en;
  }
  const localeTag = lang === 'uk' ? 'uk-UA' : lang === 'ru' ? 'ru-RU' : 'en-US';
  try {
    return `$${new Intl.NumberFormat(localeTag).format(amount)}`;
  } catch {
    return `$${amount.toLocaleString('en-US')}`;
  }
}

/**
 * Render a full "from $X[/month]" string with locale-aware prefix and suffix.
 * Fallbacks to "Custom" / "Індивідуально" / "Индивидуально" when the entry
 * has no starting price.
 */
export function renderPrice(entry: PriceEntry, lang: Locale): string {
  const fromPrefix: Record<Locale, string> = { en: 'from', uk: 'від', ru: 'от' };
  const monthSuffix: Record<Locale, string> = { en: '/month', uk: '/місяць', ru: '/мес' };

  const { amount, currency, isCustom } = getPriceForLocale(entry.fromUSD, lang);
  if (isCustom) {
    const base = formatPrice(null, currency, lang, true);
    return entry.customSuffix ? `${base} ${entry.customSuffix}` : base;
  }

  const formatted = formatPrice(amount, currency, lang);
  const recurring = entry.recurring === 'month' ? monthSuffix[lang] : '';
  return `${fromPrefix[lang]} ${formatted}${recurring}`;
}
