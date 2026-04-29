/**
 * Single source of truth for all public contact details.
 * Used by Footer, ContactsPage, schema.org Organization, Privacy Policy,
 * Impressum (DE), and any other place that surfaces an email/messenger/address.
 *
 * Update here and changes propagate everywhere.
 */

export const CONTACT = {
  // Primary (always reachable)
  email: 'info@alexeykachan.com',

  // Messengers — preferred channels until the Romanian phone line is live
  whatsapp: {
    // International E.164 format. Currently a Ukrainian number — will be
    // replaced with the Romanian one once the office is set up.
    number: '+380674618072',
    display: '+380 67 461 80 72',
    href: 'https://wa.me/380674618072',
  },
  telegram: {
    handle: '@alexeykachan',
    href: 'https://t.me/alexeykachan',
  },

  // Phone is intentionally unset right now — the Romanian line is in
  // setup. Templates show a placeholder line instead of a tel:.
  phone: null as null | { number: string; display: string; href: string },

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
    telegram:  'https://t.me/alexeykachan',
  },

  // Languages spoken by the team — surfaced in About card / footer
  languages: ['English', 'Russian', 'Ukrainian', 'German'] as const,
} as const;

export type ContactConfig = typeof CONTACT;
