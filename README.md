# Alexey Kachan Agency — alexeykachan.com

Independent digital agency website. Astro 5, TypeScript strict, Tailwind CSS 4, 8 languages, Cloudflare Pages.

## Stack

- **[Astro 5](https://astro.build/)** — static-first, view transitions, content collections
- **TypeScript** strict + `@/* → src/*` path alias
- **Tailwind CSS 4** (CSS-first via `@tailwindcss/vite`, design tokens in `src/styles/global.css`)
- **i18n** — Astro native, 8 languages: en (default, no prefix), de, fr, es, it, ro, uk, ru
- **Animations** — Lenis smooth scroll + GSAP ScrollTrigger (declarative `data-*` attrs)
- **Forms** — [Web3Forms](https://web3forms.com/) (no backend)
- **Analytics** — GTM + GA4 + Microsoft Clarity, gated behind Google Consent Mode v2
- **Hosting** — Cloudflare Pages
- **Node ≥ 20**

## Quick start

```bash
# 1. Install
npm install

# 2. Copy env template
cp .env.example .env
# fill in PUBLIC_GTM_ID, PUBLIC_CLARITY_ID, PUBLIC_WEB3FORMS_KEY

# 3. Dev
npm run dev          # http://localhost:4321

# 4. Type-check + build
npm run build        # → dist/

# 5. Preview production build
npm run preview
```

## Project structure

```
src/
├── i18n/                       # 8-language slug map + UI strings
│   ├── slugs.ts                # 40+ pageKeys × 8 langs
│   ├── utils.ts                # useTranslations / formatDate / hreflang helpers
│   └── translations/<lang>.json
├── content/                    # Astro content collections
│   ├── blog/<slug>/<lang>.md
│   └── cases/<slug>/<lang>.md
├── content.config.ts           # Zod schemas for blog + cases
├── lib/
│   ├── schema.ts               # Schema.org JSON-LD builders
│   └── page-keys.ts            # SUPPORTED_PAGE_KEYS (used by getStaticPaths)
├── layouts/
│   └── BaseLayout.astro        # Head/SEO/JSON-LD/ClientRouter wrapper
├── components/
│   ├── layout/                 # Header, Footer, Cookie, Cursor, Chat, ...
│   ├── sections/               # 12 homepage sections
│   └── templates/              # ServicesHub, ServiceDetail, BlogHub, CaseDetail, ...
├── pages/
│   ├── index.astro             # EN homepage
│   ├── [lang]/index.astro      # Other 7 homepages
│   ├── [...slug].astro         # EN catchall (services/cases/blog/about/contacts/...)
│   ├── [lang]/[...slug].astro  # Same for 7 langs
│   ├── blog/[slug].astro       # EN blog detail
│   ├── [lang]/blog/[slug].astro
│   ├── blog/tag/[tag].astro
│   ├── 404.astro
│   ├── sitemap.astro           # HTML sitemap (visible)
│   ├── rss.xml.ts              # EN RSS feed
│   └── [lang]/rss.xml.ts
├── scripts/
│   └── animations.ts           # Lenis + GSAP + cursor + intro loader
└── styles/
    └── global.css              # Tailwind 4 + tokens + reset

public/
├── _headers                    # Cloudflare security + cache headers
├── _redirects                  # 301s from old WordPress
├── robots.txt
├── site.webmanifest
└── .well-known/security.txt
```

## Adding content

### Blog post

Create `src/content/blog/<my-slug>/en.md`:

```yaml
---
title: "Post title (20–80 chars)"
description: "Description (80–200 chars)"
slug: my-slug
lang: en
published: 2026-04-29
tags: [seo, performance]
author: Alexey Kachan
featured: false
---

## Markdown body…
```

For translations, add `de.md`, `fr.md`, etc. in the same folder. Missing translations fall back to EN at runtime.

### Case study

Create `src/content/cases/<client-slug>/en.md` (see any existing case under `src/content/cases/` for the schema).

Required frontmatter: `client`, `year`, `industry`, `country`, `duration`, `services` (array), `category` (`web-development` | `marketing`), `heroMetric`, `results` (array of `{value, label, delta?}`), `stack` (array), optional `testimonial`.

## Adding a new top-level page

1. Add `pageKey` + 8-lang slug entries to `src/i18n/slugs.ts`.
2. Add the `pageKey` to `SUPPORTED_PAGE_KEYS` in `src/lib/page-keys.ts`.
3. Build a template in `src/components/templates/<MyPage>.astro`.
4. Wire a switch branch in both `src/pages/[...slug].astro` and `src/pages/[lang]/[...slug].astro`.
5. Add i18n strings to `en.json` (other languages auto-fallback).

## Deployment (Cloudflare Pages)

1. **Push to GitHub.** `main` branch is production.
2. **Cloudflare dashboard → Pages → Connect to Git** → select repo.
3. **Build settings:**
   - Build command: `npm run build`
   - Build output: `dist`
   - Node version: 20
4. **Environment variables** (Settings → Environment variables):
   - `PUBLIC_GTM_ID` = `GTM-XXXXXXX`
   - `PUBLIC_CLARITY_ID` = `xxxxxxxxxx`
   - `PUBLIC_WEB3FORMS_KEY` = `00000000-...`
5. **Custom domain:** add `alexeykachan.com` + redirect `www.` → root.
6. **Cloudflare features to enable** (DNS / Speed / Caching tabs):
   - Always Use HTTPS
   - Brotli compression
   - HTTP/3
   - HSTS (after testing — `_headers` already sets it)

### After deploy

- Submit `https://alexeykachan.com/sitemap-index.xml` to Google Search Console + Bing Webmaster Tools.
- Run [Rich Results Test](https://search.google.com/test/rich-results) on a service page (FAQ + Service + Breadcrumb schemas).
- Verify `/robots.txt`, `/sitemap-index.xml`, `/.well-known/security.txt` are reachable.
- Verify `_headers` is applied (DevTools → Network → response headers should show CSP + HSTS).
- Register HSTS preload at [hstspreload.org](https://hstspreload.org/).

## SEO & schema

Every page emits:

- `<title>`, `<meta description>`, `<link rel="canonical">`, `<meta name="robots">`
- 9 hreflang tags (8 languages + `x-default`) via `getHreflangMap()`
- Open Graph + Twitter Card with localized `og:locale` + 7 alternates
- **ProfessionalService Organization** JSON-LD (always)
- **WebSite** JSON-LD (homepage only)
- **BreadcrumbList** JSON-LD (every non-home page)
- Page-type-specific schemas: `Service` + `Offer` (service detail), `BlogPosting` (blog post), `Article` (case detail), `FAQPage` (services + homepage FAQ), `Person` (about)

## Performance

- **Lenis smooth scroll** synced with GSAP ticker
- **Hashed assets** for long-term caching (`_assets/[name]-[hash][ext]`)
- **Partytown** runs GTM in a Web Worker (off main thread)
- **Lightning CSS** for minification
- **Sharp** for AVIF/WebP image optimization
- Reveal animations only run when `prefers-reduced-motion` is OK

## Privacy

- Default consent state: **denied** (Google Consent Mode v2)
- Cookie banner shown on first visit; preferences saved to `localStorage`
- Microsoft Clarity loads only after analytics opt-in
- GTM loads always but data layer respects consent state

## License

Private. © Alexey Kachan Agency.
