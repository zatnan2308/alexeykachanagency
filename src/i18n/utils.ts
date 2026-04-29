/**
 * i18n Utilities
 * Translation helpers, language detection, URL builders
 *
 * Used by:
 *  - Layouts (BaseLayout) → for hreflang generation
 *  - Components (Header, Footer, LanguageSwitcher) → for navigation
 *  - Pages → for content & SEO
 */

import {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_NAMES,
  getLocalizedPath,
  getAlternates,
  getLangFromUrl,
  findPageKeyFromPath,
  getEquivalentUrl,
  getHreflangMap,
  type Language,
} from './slugs';

import en from './translations/en.json';
import uk from './translations/uk.json';
import ru from './translations/ru.json';

// Re-export everything from slugs for convenience
export {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_NAMES,
  getLocalizedPath,
  getAlternates,
  getLangFromUrl,
  findPageKeyFromPath,
  getEquivalentUrl,
  getHreflangMap,
  type Language,
};

// =============================================================================
// TRANSLATIONS
// =============================================================================

const translations: Record<Language, any> = {
  en, uk, ru,
};

/**
 * Get a translation by dot-notation key.
 *
 * @example
 *   const t = useTranslations('de');
 *   t('nav.services')         // "Dienstleistungen"
 *   t('cta.start_project')    // "Projekt starten"
 *
 * Falls back to English if key missing in target language.
 * Logs warning in dev, silent in production.
 */
export function useTranslations(lang: Language) {
  return function t(key: string, fallback?: string): string {
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    if (typeof value !== 'string') {
      // Fallback to English
      let fallbackValue: any = translations[DEFAULT_LANGUAGE];
      for (const k of keys) {
        fallbackValue = fallbackValue?.[k];
        if (fallbackValue === undefined) break;
      }

      if (typeof fallbackValue === 'string') {
        if (import.meta.env.DEV && lang !== DEFAULT_LANGUAGE) {
          console.warn(`[i18n] Missing translation: "${key}" for "${lang}", using EN fallback`);
        }
        return fallbackValue;
      }

      if (import.meta.env.DEV) {
        console.warn(`[i18n] Translation key not found: "${key}"`);
      }
      return fallback ?? key;
    }

    return value;
  };
}

/**
 * Get all UI strings as object for a language (useful for client islands).
 */
export function getTranslations(lang: Language): Record<string, any> {
  return translations[lang];
}

// =============================================================================
// FORMATTING
// =============================================================================

/**
 * Format a date according to locale conventions.
 *
 * @example
 *   formatDate(new Date(), 'de')  // "28. April 2026"
 *   formatDate(new Date(), 'en')  // "April 28, 2026"
 */
export function formatDate(
  date: Date | string,
  lang: Language,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(LANGUAGE_NAMES[lang].locale, options).format(d);
}

/**
 * Format a number according to locale conventions.
 *
 * @example
 *   formatNumber(1234.56, 'de')  // "1.234,56"
 *   formatNumber(1234.56, 'en')  // "1,234.56"
 */
export function formatNumber(num: number, lang: Language, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(LANGUAGE_NAMES[lang].locale, options).format(num);
}

/**
 * Format currency. Defaults to USD; pass currency code as needed.
 *
 * @example
 *   formatCurrency(1500, 'de')              // "1.500,00 $"
 *   formatCurrency(1500, 'de', 'EUR')       // "1.500,00 €"
 *   formatCurrency(1500, 'en', 'USD')       // "$1,500.00"
 */
export function formatCurrency(amount: number, lang: Language, currency = 'USD'): string {
  return new Intl.NumberFormat(LANGUAGE_NAMES[lang].locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

// =============================================================================
// READING TIME (for blog)
// =============================================================================

const WORDS_PER_MINUTE: Record<Language, number> = {
  en: 230, uk: 200, ru: 200,
};

export function calculateReadingTime(content: string, lang: Language): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE[lang]));
}

export function formatReadingTime(content: string, lang: Language): string {
  const minutes = calculateReadingTime(content, lang);
  const t = useTranslations(lang);
  return `${minutes} ${t('common.min_read')}`;
}

// =============================================================================
// LANGUAGE DETECTION (for client-side suggest banner)
// =============================================================================

/**
 * Suggest a language based on browser preferences.
 * Returns null if browser preference is already the active language.
 *
 * Used client-side in the language suggestion banner.
 */
export function suggestLanguageFromBrowser(currentLang: Language): Language | null {
  if (typeof navigator === 'undefined') return null;

  const browserLangs = navigator.languages || [navigator.language];
  for (const browserLang of browserLangs) {
    const code = browserLang.toLowerCase().split('-')[0] as Language;
    if (LANGUAGES.includes(code) && code !== currentLang) {
      return code;
    }
  }
  return null;
}

// =============================================================================
// HTML LANG ATTRIBUTE
// =============================================================================

export function getHtmlLang(lang: Language): string {
  return LANGUAGE_NAMES[lang].htmlLang;
}

export function getOgLocale(lang: Language): string {
  return LANGUAGE_NAMES[lang].ogLocale;
}
