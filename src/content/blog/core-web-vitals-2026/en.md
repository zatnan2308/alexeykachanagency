---
title: "Core Web Vitals in 2026: what actually moves rankings"
description: "INP replaced FID and changed everything. Here is what to optimize first if you have one engineering day, written from 60+ live audits."
slug: core-web-vitals-2026
lang: en
published: 2026-04-12
updated: 2026-04-25
tags: [performance, seo, web-vitals]
author: Alexey Kachan
featured: true
seoTitle: "Core Web Vitals 2026: A Practical Optimization Playbook"
seoDescription: "Real-world audit findings: which Core Web Vitals fixes deliver ranking lifts and which are pure performance theatre. INP, LCP, CLS — what to do first."
---

In March 2024 Google quietly replaced FID with **INP (Interaction to Next Paint)** as a Core Web Vital. Two years later the dust has settled, and the picture is clear: most sites that scored "good" under FID are now sitting in the orange zone. The marketing site I audited last week — Lighthouse 96 mobile, beautifully optimized for LCP — was failing INP on 38% of real-user sessions.

This is a working playbook from sixty-plus live audits I ran across 2024 and 2025: which fixes actually move rankings, which are theatre, and which day-one priorities to ship if you only have one engineering day.

## INP is now the metric that hurts most sites

INP measures the latency between a user interaction (click, tap, key press) and the next visual frame. Where FID only measured the *first* interaction's delay, INP looks at the **worst** of all interactions during a visit. That single change exposes a category of bugs that FID happily ignored: tap handlers that block paint, modal animations that freeze the main thread, dropdown menus that recompute layout for every keystroke.

The threshold for "good" INP is **200 ms**. Most React/Vue marketing sites I see hover between 220 and 380 ms — comfortably "needs improvement". The good news: INP is fixable. The bad news: the standard performance advice (image optimization, code splitting, lazy loading) does almost nothing for INP. INP is a JavaScript main-thread problem, and you fix it by removing main-thread work.

### The three biggest INP offenders

**1. Heavy event handlers without yielding.** A `click` handler that runs 80ms of synchronous JavaScript will block paint and torch your INP score. Wrap expensive handlers in `requestIdleCallback` or break them up with `await scheduler.yield()` (or `setTimeout(0)` if you cannot use the scheduler API yet). The pattern is the same: do the visual update first, defer the rest.

**2. Render-blocking state libraries.** Older Redux setups that re-render entire trees on every action are a textbook INP killer. Modern apps use selective subscriptions (Zustand, Jotai, React's `useSyncExternalStore`) to scope updates. If you are still on legacy Redux without `reselect` memoization, the migration pays for itself in INP alone.

**3. Layout thrashing in scroll/resize handlers.** Reading a layout property (`offsetHeight`, `getBoundingClientRect`) and then writing to the DOM in the same frame forces a synchronous reflow. In a scroll handler firing 60 times a second, this is a guaranteed INP penalty. Batch reads first, writes second, or use `IntersectionObserver` and `ResizeObserver` to avoid the polling pattern entirely.

## LCP optimization is mostly solved

For LCP (Largest Contentful Paint, target ≤ 2.5 s), the playbook in 2026 is well-known and works:

- **Preload the hero image** with `<link rel="preload" as="image" fetchpriority="high">`. Six lines of HTML, often -800 ms LCP.
- **Serve AVIF or WebP** with a JPEG fallback. AVIF averages 50% smaller than JPEG at the same visual quality.
- **Use `fetchpriority="high"`** on the LCP element. Browsers without preload support still benefit.
- **Don't lazy-load above-the-fold images.** I see this every audit. `loading="lazy"` on the hero adds 600-1200 ms to LCP.
- **Self-host fonts** with `font-display: swap` and preload the most critical font file. Web font flickers count toward LCP.

If your LCP is still over 2.5 s after these five fixes, the problem is your hosting (slow TTFB) or your CMS (heavy server rendering). At that point, edge deployment (Cloudflare Pages, Vercel Edge) usually solves it in an afternoon.

## CLS: the metric you stopped caring about, but Google still does

Cumulative Layout Shift is a solved problem in 2026, but it has not gone away. The mistake I see most often: a developer fixes CLS for the desktop viewport, ships, and never tests the mobile cookie banner that ships its own Layout Shift bomb three seconds after page load.

The threshold is **0.1**. Six fixes cover 95% of cases:

1. Always set `width` and `height` attributes on `<img>` and `<video>`. Aspect ratio is reserved before load.
2. Use `font-display: optional` for non-critical fonts. `swap` is fine for most cases, but `optional` eliminates font-flicker shifts entirely.
3. Reserve space for ads, embeds, and dynamically inserted content with explicit `min-height` on the parent.
4. Cookie banners and notification bars: position with `transform`, not by inserting them above page content.
5. Avoid CSS animations that change `top`, `left`, `width`, or `height`. Use `transform` and `opacity` only.
6. Skeleton loaders should match the final content's dimensions, not be smaller "for politeness".

CLS is the one metric where automated monitoring catches what manual testing misses. Set up Real User Monitoring (Cloudflare Web Analytics, Vercel Speed Insights, or `web-vitals` library) and watch the 75th percentile, not the median.

## What does *not* move rankings

A few things the SEO industry still recommends in 2026 that, in my experience, deliver close to zero ranking lift:

- **Brotli over gzip on text assets.** Your CDN already does this. The gain is real but tiny — mid-double-digit kilobytes — and Lighthouse alone catches it.
- **HTTP/3.** Quietly enabled by every major CDN. Worth zero conscious effort.
- **Critical CSS extraction tools.** In 2018 these saved 200 ms FCP. Today, Astro and Next.js inline critical CSS automatically and the manual route adds complexity without measurable benefit.
- **Tree-shaking the last 20 KB of unused code.** Worth doing for engineering hygiene; not measurable in Search Console.

I would rather spend an engineering day on one INP fix than three days on Lighthouse 99 → 100. Lighthouse measures lab conditions; rankings come from real-user sessions.

## The one-engineering-day priority list

If a CTO emails me on Monday saying "we have a sprint Wednesday, what should we ship", here is the priority list, every time:

**Hour 1: measure.** Pull the last 28 days of Search Console Core Web Vitals report. Identify the worst-scoring URL group. This is your target.

**Hours 2–4: INP triage.** Open the worst page in Chrome DevTools, Performance panel, with throttling set to 4× CPU slowdown. Click around the actual interactive elements. Profile the resulting flame chart. The worst offender is usually a single function — fix it, ship it, move on. INP fixes have the highest ROI of anything you can do in 2026.

**Hours 5–6: LCP image preload.** If LCP is over 2 s, ship the hero image preload + AVIF fallback. -500 to -1200 ms is the typical lift.

**Hours 7–8: CLS sweep.** Run Lighthouse, click every CLS warning, fix the obvious ones. Most are missing image dimensions.

**Final hour: verify.** Re-run Lighthouse on production after deploy. Check Search Console in 28 days for the field-data update.

This routine has lifted multiple sites from "needs improvement" to "good" across all three CWV in a single sprint. None of it requires touching your CMS, your design, or your content. It is pure engineering hygiene — and Google has been clear since 2021 that engineering hygiene is a ranking signal.

## Where this is going

Google has signalled that the next CWV addition will likely cover **scroll responsiveness** — measuring the latency between a scroll input and the next paint. Early experimental builds of Chrome already collect this metric under the name "scroll INP". If you optimize for INP today, you are already 80% of the way to whatever ships next.

The deeper trend is harder to miss: Google's ranking signals are moving from "is this site technically correct" to "is this site pleasant to use". CWV is the public, measurable version of that question. Sites that take it seriously will keep their rankings. Sites that hit Lighthouse 99 and call it a day will keep slipping.

If you want a free 30-minute Core Web Vitals audit on your own site — pulling field data from Search Console, identifying the worst URL group, and a written priority list for your next sprint — [reach out](/contacts/). I respond within four hours during business hours.
