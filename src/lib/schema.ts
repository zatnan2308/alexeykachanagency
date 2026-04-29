/**
 * Schema.org JSON-LD builders — typed, tested, reused across page templates.
 * All builders return plain objects suitable for JSON.stringify in <script type="application/ld+json">.
 *
 * Conventions:
 *  - Always use absolute URLs (pass `siteOrigin` from `Astro.site?.origin`).
 *  - Reference the global Organization via `@id: '<origin>/#organization'` (set in BaseLayout).
 *  - Locale strings should use IETF tags like 'en-US' or short codes 'en' depending on consumer.
 */

import { LANGUAGE_NAMES, type Language } from '@/i18n/slugs';

// =============================================================================
// BreadcrumbList — required on every non-home page (master prompt §6)
// =============================================================================

export interface BreadcrumbItem {
  name: string;
  url: string; // absolute URL
}

export function buildBreadcrumb(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// =============================================================================
// Service + Offer (for service detail pages)
// =============================================================================

export interface ServiceTier {
  name: string;
  price: number | null; // null → custom quote
  currency?: string;    // e.g. 'USD' (default)
  description?: string;
  url: string;
}

export interface ServiceSchemaInput {
  serviceName: string;
  serviceType: string; // e.g. 'Web Development'
  description: string;
  url: string;
  siteOrigin: string;
  lang: Language;
  tiers: ServiceTier[];
  areaServed?: string[]; // e.g. ['Worldwide']
}

export function buildServiceSchema(input: ServiceSchemaInput) {
  const offers = input.tiers.map((t) => ({
    '@type': 'Offer',
    name: t.name,
    description: t.description ?? input.serviceName,
    url: t.url,
    ...(t.price !== null
      ? {
          price: t.price.toString(),
          priceCurrency: t.currency ?? 'USD',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: t.price,
            priceCurrency: t.currency ?? 'USD',
          },
        }
      : {
          priceRange: 'Custom — request a quote',
        }),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.serviceName,
    serviceType: input.serviceType,
    description: input.description,
    url: input.url,
    inLanguage: LANGUAGE_NAMES[input.lang].htmlLang,
    provider: { '@id': `${input.siteOrigin}/#organization` },
    areaServed: input.areaServed ?? ['Worldwide'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${input.serviceName} packages`,
      itemListElement: offers,
    },
  };
}

// =============================================================================
// FAQPage (already inlined in some templates; centralize here for reuse)
// =============================================================================

export interface FaqItem { question: string; answer: string }

export function buildFaqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}
