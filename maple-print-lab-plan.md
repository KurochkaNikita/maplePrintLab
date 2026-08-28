# План: сайт Maple Print Lab (Next.js + TypeScript + Tailwind)

Цель: лёгкий, SEO-дружелюбный сайт-визитка на 3 страницы (Главная, Наши работы, Контакты) для локальной канадской 3D-печатной студии. Стек: Next.js 14 (App Router), TypeScript, Tailwind CSS, статический экспорт (`output: "export"`) — без сервера, максимально быстрая загрузка.

Ниже — пошаговый план в порядке выполнения. Каждый шаг — это то, что агент должен сделать и проверить перед переходом к следующему.

---

## Этап 0 — Инициализация проекта

1. Создать директорию проекта `maple-print-lab/`.
2. Сгенерировать `package.json` с зависимостями:
   - `next`, `react`, `react-dom`
   - dev: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `postcss`, `autoprefixer`
3. `tsconfig.json` — строгий режим (`strict: true`), путь-алиас `@/*` → корень проекта.
4. `next.config.mjs`:
   - `output: "export"` (статический сайт, без Node-сервера)
   - `images.unoptimized: true` (обязательно при static export)
   - `trailingSlash: true`
5. `postcss.config.mjs` + `tailwind.config.ts` с `content` на `./app/**/*.{ts,tsx}` и `./components/**/*.{ts,tsx}`.
6. `.gitignore` (`node_modules`, `.next`, `out`, `next-env.d.ts`).

**Проверка:** `npm install` проходит без ошибок.

---

## Этап 1 — Токены дизайна (Tailwind theme)

Не использовать дефолтную палитру "терракота на кремовом" — она читается как шаблонная. Взять цвета из мира самой студии (3D-печать + канадский клён):

| Токен | Hex | Роль |
|---|---|---|
| `charcoal` | `#22201D` | тёмный фон / текст заголовков |
| `filament` | `#F7F0E1` | основной фон (тёплый "сырой пластик") |
| `amber` | `#B9722E` | акцент №1 (кленовый сироп) |
| `amber-deep` | `#8F551F` | тёмный вариант акцента |
| `teal` | `#2F6E64` | акцент №2 (цвет катушки филамента) |
| `ink` | `#3A3F44` | текст |
| `line` | `#DDD6C9` | тонкие разделители |

Шрифты (через `next/font/google`, самохостинг):
- **Display**: Space Grotesk (500/600) — заголовки, технично
- **Body**: IBM Plex Sans (400/500) — основной текст
- **Mono**: IBM Plex Mono (400/500) — лейблы, метки, uppercase-детали
- **Accent**: Fraunces italic (500) — тёплые акцентные фразы

Прописать всё это в `tailwind.config.ts` (`extend.colors`, `extend.fontFamily` через CSS-переменные `--font-*`) и подключить шрифты в `app/layout.tsx`.

**Проверка:** токены доступны как классы (`bg-filament`, `text-amber`, `font-display` и т.д.).

---

## Этап 2 — Фирменный визуальный элемент (signature)

Один яркий, но обоснованный акцент: кленовый лист, который "допечатывается" горизонтальными слоями снизу вверх — буквальная метафора "Maple" + "Print Lab" (3D-печать идёт слоями).

- Компонент `components/LayerLeaf.tsx`: SVG с `clipPath` в форме листа, внутри — 8-9 горизонтальных `rect`, окрашенных по кругу в amber/teal/charcoal, с CSS-анимацией `layer-rise` (появление снизу с задержкой по каждому слою).
- Чистый CSS, без клиентского JS.
- Обязательно уважать `prefers-reduced-motion` — в `globals.css` глобально гасить анимации через медиа-запрос.

**Проверка:** элемент рендерится как server component, без `"use client"`.

---

## Этап 3 — Общий каркас (layout, header, footer)

1. `lib/site-config.ts` — единый источник правды: название, домен (заглушка, пометить `TODO`), email/Instagram (заглушки, пометить `TODO`), регион, ссылки навигации.
2. `components/Header.tsx` — логотип текстом (лого пока нет), навигация на 3 страницы, `font-mono uppercase` для пунктов меню.
3. `components/Footer.tsx` — контакты, регион, копирайт.
4. `components/JsonLd.tsx` — структурированные данные `Store`/`LocalBusiness` (Metro Vancouver, BC, Canada) для локального SEO.
5. `app/layout.tsx`:
   - Подключить шрифты через `next/font/google`
   - `metadataBase`, `title.template`, `description`, `keywords`, `openGraph`, `twitter`, `robots`
   - Вставить `<Header />`, `<Footer />`, `<JsonLd />` вокруг `{children}`

**Проверка:** layout собирается без ошибок типов (`npx tsc --noEmit`).

---

## Этап 4 — Страницы

### `app/page.tsx` — Главная
- Hero: `LayerLeaf` + заголовок + подзаголовок (`font-accent italic`) + 2 CTA-кнопки (На работы / Написать нам)
- Блок "Что мы делаем" — 3 колонки: игрушки/коллекции, декор для дома, кастом
- Блок "Последние работы" — 3 карточки-плейсхолдера (см. Этап 5), ссылка "Смотреть все"
- Блок доверия: локальная канадская печать под заказ, без склада — с CTA на контакты

### `app/work/page.tsx` — Наши работы
- Свои `metadata` (title/description/canonical)
- 3 секции по категориям (Игрушки, Декор, Кастом), в каждой — сетка из 3 карточек-плейсхолдеров с материалом и коротким описанием

### `app/contact/page.tsx` — Контакты
- Свои `metadata`
- Просто: email, Instagram, регион — без формы (на этапе пилота прямой контакт работает быстрее формы)

**Проверка:** каждая страница экспортирует собственный `metadata` объект с `title` и `alternates.canonical`.

---

## Этап 5 — Карточка работ (плейсхолдер под фото)

`components/WorkCard.tsx`:
- Пока нет реальных фото — цветной градиентный блок (amber/teal/charcoal тон) вместо фото + подпись материала
- В комментарии прямо в файле — как заменить на `<Image>` из `next/image`, когда появятся фотографии (путь `public/work/...`)

**Проверка:** компонент принимает `title`, `material`, `note`, `tone`.

---

## Этап 6 — SEO-инфраструктура

1. `app/sitemap.ts` — генерирует `sitemap.xml` из списка роутов и `siteConfig.url`
2. `app/robots.ts` — генерирует `robots.txt`, ссылается на sitemap
3. Проверить на каждой странице: один `<h1>`, логичная иерархия `h2`/`h3`, alt-текст у SVG (`role="img"` + `aria-label`)
4. `JsonLd` из Этапа 3 — подключить в layout один раз

**Проверка:** после сборки `out/sitemap.xml` и `out/robots.txt` существуют и содержат правильные URL.

---

## Этап 7 — Сборка и проверка

```bash
npm install
npx tsc --noEmit          # проверка типов
npm run build              # статическая сборка в out/
```

Если сборка падает на загрузке шрифтов Google Fonts — проверить доступ к интернету у среды сборки (нужен доступ к `fonts.googleapis.com`), это не ошибка кода.

**Ручная проверка перед публикацией:**
- Открыть все 3 страницы, проверить, что нет сдвига layout при загрузке шрифтов
- Проверить мобильную адаптивность (нав должен переноситься на маленьких экранах)
- Проверить видимый фокус при табуляции (`Tab` по ссылкам/кнопкам)
- Прогнать через Lighthouse — ожидается высокий Performance/SEO score благодаря статике и отсутствию тяжёлого JS

---

## Этап 8 — Перед реальным запуском (не автоматизируется агентом)

- Зарегистрировать домен `mapleprintlab.ca` (или `.com`), обновить `siteConfig.url`
- Заменить email/Instagram-заглушки на реальные
- Добавить настоящие фото работ, сжать (< ~200KB на фото), заменить плейсхолдеры в `WorkCard`
- Добавить OG-изображение (`public/og-image.jpg`, 1200×630) и прописать в `openGraph.images`
- Задеплоить `out/` на Vercel/Netlify/Cloudflare Pages
- Добавить сайт в Google Search Console, отправить `sitemap.xml`

---

## Этап 9 — Мультиязычность (EN / FR) — реализовано

Сайт двуязычный: английский и французский (официальные языки Канады). Русский — только рабочий язык плана/заметок, на сайте его нет.

Весь код — в `src/` (`src/app`, `src/components`, `src/lib`); алиас `@/*` → `./src/*`.

- Роутинг: `src/app/[lang]/` с `generateStaticParams` → `en | fr`, `dynamicParams = false`. `src/app/[lang]/layout.tsx` рендерит `<html lang>` по локали. `src/app/layout.tsx` — сквозной (просто `return children`), чтобы и `/` и `/[lang]/` имели каждый свой `<html>`.
- `next.config.mjs`: `output: "export"` только в production-сборке (`NODE_ENV === "production"`), иначе `next dev` ломается на dynamic-роуте `[lang]`.
- Словари: `src/lib/dictionaries/{en,fr}.ts`. Тип `Dictionary` выводится из `en.ts`, `fr.ts` обязан ему соответствовать (TS ловит пропущенные ключи). Языконезависимые факты (email, домен, Instagram) — в `src/lib/site-config.ts`.
- `src/lib/i18n.ts` — `locales`, `localeTag` (BCP-47 для `<html lang>` / hreflang), `localeLabel`, `localeHref()`, `getDictionary()`.
- Переключатель языка: `src/components/LocaleSwitcher.tsx` (`"use client"`, `usePathname()` — меняет первый сегмент пути, сохраняя страницу).
- SEO: у каждой страницы `alternates.canonical` + `alternates.languages` (hreflang по обеим локалям + `x-default` → `/en/`). `src/app/sitemap.ts` отдаёт 2 локали × 3 страницы с `xhtml:link` alternates.
- Корень `/`: `src/app/page.tsx` — языковой пикер (ссылки, видны без JS) + клиентский редирект `src/app/root-redirect.tsx` (`"use client"`, детект `navigator.languages` → `/en|fr/`). Работает одинаково в `dev` и в статическом экспорте.
- Шрифты — латиница (`latin`, `latin-ext`), достаточно для en/fr.

Добавить новую локаль = новый файл в `src/lib/dictionaries/` + строка в `locales`/`localeTag`/`localeLabel` в `src/lib/i18n.ts` + (если другой алфавит) сабсет/фолбэк-шрифт для кириллицы и т.п.

---

## Порядок выполнения для агента

Этапы 0 → 1 → 2 → 3 → 4 → 5 → 6 строго последовательно (каждый следующий использует то, что создано раньше). Этап 7 — после каждого крупного этапа полезно гонять `tsc --noEmit`, не откладывать проверку на самый конец. Этап 8 — руками, отдельно от кода. Этап 9 (мультиязычность EN/FR) — уже сделан.
