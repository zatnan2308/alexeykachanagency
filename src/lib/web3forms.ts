/**
 * Web3Forms — single source for the public access key + submit endpoint.
 *
 * The access key is PUBLIC by design: it is emitted into client-side HTML and
 * only routes submissions to the inbox configured in the Web3Forms account
 * (currently mail@alexeykachan.com). It is safe to keep in the repo / client code.
 *
 * Override per environment with `PUBLIC_WEB3FORMS_KEY` (see .env / .env.example).
 * There is NO server runtime — the site is fully static and forms post directly
 * to Web3Forms from the browser. No SMTP, no nodemailer, no passwords.
 *
 * Consumers: Contacts form, Brief forms (website/ads), Footer newsletter.
 */
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export const WEB3FORMS_ACCESS_KEY =
  (import.meta.env.PUBLIC_WEB3FORMS_KEY as string | undefined) ||
  '412b7e61-500f-47f4-ad97-264e6e9d2626';
