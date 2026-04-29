/**
 * Content Collections — Astro 5 native (content layer).
 *
 * Blog structure:
 *   src/content/blog/<slug>/<lang>.md
 *   - One <slug> represents one logical article
 *   - Each <lang>.md is a translation (en.md is master)
 *   - Missing translations fall back to en.md at render time
 *
 * Frontmatter schema is enforced via zod.
 */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { LANGUAGES } from '@/i18n/slugs';

const langSchema = z.enum(LANGUAGES as unknown as [string, ...string[]]);

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      // Required
      title:        z.string().min(20).max(80),
      description:  z.string().min(80).max(200),
      slug:         z.string().regex(/^[a-z0-9-]+$/, 'kebab-case slug only'),
      lang:         langSchema,
      published:    z.coerce.date(),

      // Optional
      updated:      z.coerce.date().optional(),
      cover:        image().optional(),
      coverAlt:     z.string().optional(),
      tags:         z.array(z.string()).default([]),
      author:       z.string().default('Alexey Kachan'),
      featured:     z.boolean().default(false),
      draft:        z.boolean().default(false),

      // SEO overrides (optional — if absent, title/description are used)
      seoTitle:       z.string().optional(),
      seoDescription: z.string().optional(),
    }),
});

/**
 * Case studies — same structure as blog (one slug, multiple languages).
 *  src/content/cases/<slug>/<lang>.md
 */
const casesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: ({ image }) =>
    z.object({
      title:        z.string().min(8).max(100),
      description:  z.string().min(60).max(220),
      slug:         z.string().regex(/^[a-z0-9-]+$/, 'kebab-case slug only'),
      lang:         langSchema,
      published:    z.coerce.date(),

      client:       z.string(),
      year:         z.number().int(),
      industry:     z.string(),
      country:      z.string(),
      duration:     z.string(),
      services:     z.array(z.string()).min(1),
      // Hub category — drives which hub the case appears on
      category:     z.enum(['web-development', 'marketing']),
      // Headline metric for the hub card (e.g. "+186% organic traffic")
      heroMetric:   z.string(),
      // Up to 4 KPI deltas displayed in the case detail page
      results:      z.array(z.object({
        value: z.string(),
        label: z.string(),
        delta: z.string().optional(), // e.g. "+186%", "-38%"
      })).default([]),
      stack:        z.array(z.string()).default([]),
      cover:        image().optional(),
      coverAlt:     z.string().optional(),
      accent:       z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#d7ff3d'),
      featured:     z.boolean().default(false),
      draft:        z.boolean().default(false),
      testimonial:  z.object({
        quote:  z.string(),
        author: z.string(),
        role:   z.string(),
      }).optional(),

      seoTitle:       z.string().optional(),
      seoDescription: z.string().optional(),
    }),
});

export const collections = {
  blog: blogCollection,
  cases: casesCollection,
};
