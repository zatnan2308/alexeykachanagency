/**
 * Single source of truth for all public contact details.
 * Used by Footer, ContactsPage, schema.org Organization, Privacy Policy,
 * and any other place that surfaces an email/messenger/address.
 *
 * Update here and changes propagate everywhere.
 */

export const CONTACT = {
  // Primary (always reachable)
  email: 'info@alexeykachan.com',

  // Messengers — Romanian line is live and used for WhatsApp and voice calls.
  whatsapp: {
    // International E.164 format. Romanian (+40).
    number: '+40735972434',
    display: '+40 735 972 434',
    href: 'https://wa.me/40735972434',
  },
  telegram: {
    handle: '@alexeykachanro',
    href: 'https://t.me/alexeykachanro',
  },

  // Voice phone — same Romanian line as WhatsApp.
  phone: {
    number: '+40735972434',
    display: '+40 735 972 434',
    href: 'tel:+40735972434',
  } as null | { number: string; display: string; href: string },

  // Office / business address — used in Organization schema (city + country
  // only until the postal address is confirmed).
  address: {
    city: 'Bucharest',
    country: 'Romania',
    countryCode: 'RO',
    region: 'EU',
    note: 'EU-based business · GDPR compliant',
  },

  // Social
  social: {
    facebook:  'https://www.facebook.com/alexeykachan',
    instagram: 'https://www.instagram.com/alexeykachan',
    telegram:  'https://t.me/alexeykachanro',
    linkedin:  'https://www.linkedin.com/in/alexeykachanro/',
  },

  // Languages spoken by the team — surfaced in About card / footer
  languages: ['English', 'Russian', 'Ukrainian'] as const,
} as const;

export type ContactConfig = typeof CONTACT;
