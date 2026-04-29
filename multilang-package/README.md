# Multilingual Package — Alexey Kachan Agency

Полный пакет файлов для запуска multilingual-сайта на Astro с поддержкой 8 языков.

## Что внутри

```
multilang-package/
├── astro.config.mjs              — конфиг Astro 5 с i18n, sitemap, partytown
├── package.json                  — все зависимости (Astro 5, Tailwind 4, GSAP, Motion)
├── keyword-research-plan.md      — keyword research для всех языков и услуг
├── public/
│   └── _redirects                — 301-редиректы со старого WordPress (Cloudflare Pages)
└── src/
    ├── i18n/
    │   ├── slugs.ts              — карта URL для всех языков + 6 утилит
    │   ├── utils.ts              — useTranslations(), formatDate, formatCurrency и т.п.
    │   └── translations/
    │       ├── en.json           ✅ MASTER (статус: complete)
    │       ├── de.json           ⚠️ DRAFT (нужна проверка носителем)
    │       ├── fr.json           ⚠️ DRAFT
    │       ├── es.json           ⚠️ DRAFT
    │       ├── it.json           ⚠️ DRAFT
    │       ├── ro.json           ⚠️ DRAFT
    │       ├── uk.json           ⚠️ DRAFT
    │       └── ru.json           ⚠️ DRAFT
    └── components/layout/
        ├── LanguageSwitcher.astro          — переключатель языков (dropdown + list варианты)
        └── LanguageSuggestionBanner.astro  — баннер предложения сменить язык
```

## Шаги установки

1. **Создать новый Astro-проект** (если ещё не создан):
   ```bash
   npm create astro@latest alexeykachan-agency
   cd alexeykachan-agency
   ```

2. **Заменить `package.json`** на тот, что в этом пакете, и установить зависимости:
   ```bash
   npm install
   ```

3. **Скопировать `astro.config.mjs`** в корень проекта — заменяет дефолтный конфиг.

4. **Скопировать `src/i18n/`** целиком в `src/`:
   ```bash
   cp -r multilang-package/src/i18n ./src/
   ```

5. **Скопировать компоненты**:
   ```bash
   cp -r multilang-package/src/components/layout ./src/components/
   ```

6. **Скопировать `_redirects`** в `public/` (для Cloudflare Pages):
   ```bash
   cp multilang-package/public/_redirects ./public/
   ```

7. **Настроить алиасы в `tsconfig.json`** (для импортов вида `@/i18n/utils`):
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```

8. **Запустить dev-сервер**:
   ```bash
   npm run dev
   ```

## Использование в коде

### В страницах (`src/pages/...`)

```astro
---
import { getLangFromUrl, useTranslations, getLocalizedPath } from '@/i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const homeUrl = getLocalizedPath('home', lang);
---

<h1>{t('hero.title_line_1')}</h1>
<a href={homeUrl}>{t('nav.home')}</a>
```

### В layout — hreflang теги

```astro
---
import { getHreflangMap, getLangFromUrl } from '@/i18n/utils';

const lang = getLangFromUrl(Astro.url);
const pageKey = 'services.website-development'; // зависит от страницы
const hreflangs = getHreflangMap(pageKey);
---

<head>
  {hreflangs.map(({ hreflang, href }) => (
    <link rel="alternate" hreflang={hreflang} href={href} />
  ))}
</head>
```

### Использование LanguageSwitcher

```astro
---
import LanguageSwitcher from '@/components/layout/LanguageSwitcher.astro';
---

<!-- Компактный для header -->
<LanguageSwitcher variant="dropdown" align="right" />

<!-- Расширенный для footer -->
<LanguageSwitcher variant="list" />

<!-- С английскими названиями -->
<LanguageSwitcher variant="dropdown" showEnglishNames={true} />
```

### Использование LanguageSuggestionBanner

Поместить **один раз** в `BaseLayout.astro` (не на каждой странице):

```astro
---
import LanguageSuggestionBanner from '@/components/layout/LanguageSuggestionBanner.astro';
---

<body>
  <slot />
  <LanguageSuggestionBanner />
</body>
```

## ⚠️ Важные предупреждения

### 1. Переводы — DRAFT-статус

Все 7 нерусских/неанглийских переводов сделаны AI и помечены `_meta.status: "draft_ai_translated"`. **До запуска обязательно** дайте проверить носителям языка:

- **DE** — критично, немцы очень требовательны к языку, особенно в B2B
- **FR** — проверить тон (vous/tu — мы используем формальное "vous")
- **ES** — решить: испанский Испании или нейтральный? Сейчас — Испания
- **IT, RO** — пройтись на предмет калек с английского
- **UK** — особенно проверить термины, "проєкт" vs "проект" и т.п.
- **RU** — проверить наклонения, "вы/Вы"

После проверки носителем — поменяйте `_meta.status` на `"complete"` и `needs_native_review` на `false`.

### 2. Keyword Research — приблизительные цифры

Объёмы (MV) и сложность (KD) в `keyword-research-plan.md` — **ориентировочные**, основаны на типичных паттернах рынков. Перед запуском Google Ads и финальной SEO-стратегии:

1. Сверить через **Google Keyword Planner** (бесплатно, привязка к региону)
2. Сверить через **Ahrefs/Semrush/Mangools** для точных KD
3. Проверить **Google Trends** для сезонности

### 3. Slugs — финальное согласование

Перед стартом разработки пройдитесь по `slugs.ts` и согласуйте URL для каждого языка. После запуска — каждое изменение URL стоит 301-редиректа и риска просадки SEO.

### 4. Cloudflare Pages

Файл `_redirects` рассчитан на Cloudflare Pages. Если хостинг другой:
- **Vercel** — переделать в `vercel.json` (формат другой)
- **Netlify** — формат `_redirects` идентичен, работает as-is
- **Apache/Nginx** — переделать в `.htaccess` или `nginx.conf`

## Что дальше

Готовый каркас i18n. Чтобы запустить полноценный сайт, нужно дополнительно создать:

1. **`src/layouts/BaseLayout.astro`** — обёртка с hreflang, OG, Schema.org JSON-LD
2. **`src/components/layout/Header.astro`** и **Footer.astro** — с использованием LanguageSwitcher
3. **`src/pages/index.astro`** + 7 локализованных версий (`src/pages/[lang]/index.astro`)
4. **`src/pages/services/[slug].astro`** — динамические страницы услуг с локализацией
5. **`src/content/config.ts`** — Astro Content Collections для блога и кейсов
6. **Дизайн-токены** в `src/styles/global.css` — переменные `--accent`, `--bg-primary` и т.п. (компоненты используют CSS переменные)

Если нужно — могу сделать следующим шагом любой из этих кусков.
