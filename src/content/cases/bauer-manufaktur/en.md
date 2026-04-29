---
title: "Bauer Manufaktur: B2B manufacturer site rebuild"
description: "A 28-year German precision-tools manufacturer with a beautiful catalogue and a website nobody could find. We rebuilt it on Astro, doubled organic traffic in two quarters, and tripled qualified inquiries."
slug: bauer-manufaktur
lang: en
published: 2026-02-15

client: Bauer Manufaktur
year: 2025
industry: Industrial manufacturing
country: Germany
duration: 6 weeks
services: ["Web Development", "SEO", "Web Design"]
category: web-development
heroMetric: "+186% organic traffic"
accent: "#d7ff3d"
featured: true

results:
  - value: "+186%"
    label: "Organic traffic, Q4 2025 vs Q4 2024"
    delta: "+186%"
  - value: "3.4×"
    label: "Qualified inquiries per month"
    delta: "+240%"
  - value: "98"
    label: "Lighthouse mobile (CWV all green)"
  - value: "0"
    label: "Lost rankings during migration"

stack: ["Astro", "Sanity CMS", "Cloudflare Pages", "Mux video", "Plausible"]

testimonial:
  quote: "Five weeks to a new site, no traffic loss, and inquiries tripled in the first quarter. We had three quotes — Alexey was not the cheapest, but he was the only one who guaranteed zero ranking loss in writing. He delivered."
  author: "Markus Bauer"
  role: "Managing Director, Bauer Manufaktur"
---

## The challenge

Bauer Manufaktur has been making precision metal components for German automotive and aerospace clients since 1996. By any product metric they were thriving — clients on five continents, lead times competitors envied, certification levels (ISO 9001, IATF 16949, EN 9100) most shops could only dream of.

Their website did not reflect any of that.

The existing site was a 2015 WordPress build with a custom theme, 47 plugins, and a CMS workflow that required a phone call to the original agency every time someone wanted to change a price list. Mobile Lighthouse scored 24. The product catalogue — 800+ part numbers — lived in a separate static PDF that nobody could search. Organic traffic had been flat for three years despite being the best ISO-certified shop in their category.

The kicker: their three biggest competitors had nicer websites and were starting to outrank them on terms Bauer had owned for a decade.

## What we did

The engagement ran six weeks end to end, split into a discovery sprint, four build sprints, and a launch sprint with monitored cutover.

**Discovery week.** We started with a full SEO audit, exporting every ranked URL with its position, traffic, and backlinks. The catalogue PDF was indexed but useless to Google — page 47 of a PDF cannot rank for a long-tail bearing query. We built a redirect map covering every ranked URL, every link a customer might have bookmarked, and every campaign URL going back to 2018.

**The new site, in plain terms.** A focused 22-page Astro site with a Sanity CMS for the catalogue. The 800+ part numbers became 800+ indexable, individually rankable pages — each with the part data, downloadable spec sheet, and a "request a quote" form pre-filled with the part number. Every ISO certification got its own page, with the actual certificate as a downloadable PDF (not a hotlinked image). The contact form went from a 14-field generic web form to a 3-question intent-based form that routes to the right person inside Bauer based on the answer to the first question.

**SEO migration done properly.** The old site had 312 indexed URLs. We mapped 297 of them to new equivalents (the other 15 were thin or duplicate). Every redirect was set up before launch, tested on a staging environment, and verified in production within 30 minutes of cutover. Bauer's traffic dipped 4% on launch day — a normal cutover wobble — and was back to baseline within 9 days.

**Performance and CWV.** Astro static generation, Cloudflare Pages edge, AVIF imagery, font subsetting. Lighthouse mobile went from 24 to 98. INP — the metric that matters most for ranking in 2026 — landed at 78 ms (target: ≤ 200 ms). The site is now in the 95th percentile of B2B manufacturing sites worldwide.

## The numbers, three quarters in

We baselined Q4 2024 (the last full quarter on the old site) against Q4 2025 (one quarter post-launch).

- **Organic sessions: +186%.** From 4,200/quarter to 12,000/quarter.
- **Pages ranking on page 1 of Google.de:** 18 → 67. The catalogue pages are doing the heaviest lifting; Bauer now appears for long-tail bearing-spec queries that simply did not exist as indexable pages before.
- **Qualified inquiries per month: 3.4× growth.** Sales attributes most of the lift to the simpler contact form and the per-product quote pre-fill — the form changes alone seem to have closed about 60% of the gap; the rest came from organic traffic growth.
- **Average inquiry value: +18%.** Not designed for, but a pleasant side effect of the per-product quote forms — buyers are arriving with a specific part in mind, not a generic "tell us about your project" message.

## What was harder than expected

The catalogue migration. Bauer had part data in three places — an Excel master, a slightly out-of-date PDF, and the old website (which had its own additional fields). Reconciling them took a full week longer than budgeted. We absorbed the cost on our side; the catalogue is now in a single source of truth (Sanity), and Bauer's team can update prices and lead times in real time.

## What is next

We are currently in a 12-month support engagement (Growth tier). Quarterly content production — case studies, technical deep-dives, ISO certification explainers — is now part of the workflow. The next big bet is a multilingual rollout to French and Italian, targeting Bauer's European market beyond DACH. That work begins in Q2 2026.

If you are an industrial manufacturer in a similar position — strong product, weak website, ranking quietly slipping — [we'd happily run a 30-minute audit](/contacts/) on the house. No pitch, just a written priority list of what we'd fix first.
