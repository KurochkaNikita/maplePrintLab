# Maple Print Lab — project rules

Next.js static export (`output: "export"`, `trailingSlash: true`), languages `en` and `fr`.
Because it is a static export, `next.config` redirects and `middleware.ts` do NOT work — redirects go in the host config (e.g. `vercel.json`).

## Always follow: SEO

- **One origin.** Use `siteConfig.url` (`src/lib/site-config.ts`, from `NEXT_PUBLIC_SITE_URL`, fallback `https://mapleprintlab.store`). Never hard-code a domain anywhere else.
- **Canonical** on every page points to its own URL on the main domain, same language folder, with trailing slash. Build it via `pageMetadata` / `rootMetadata` in `src/lib/metadata.ts`; don't hand-write `alternates`.
- **hreflang:** `en-CA`, `fr-CA`, `x-default` (→ English), identical on EN and FR versions of a page. Omit a language that has no translation.
- **`og:url`** equals the canonical. Sitemap and robots use only the main domain; sitemap has both languages with `xhtml:link` alternates.
- `/` has no redirect; its canonical is `/en/`. No language redirect by `Accept-Language`.
- **Title ≤ 60 characters including the template suffix** ` — Maple Print Lab` (18 chars). **Description ≤ 155.** One `<h1>` per page.
- Product/category copy: items are **3D-printed to order**, never "handmade". Layered art size is 25 × 25 × 1.5 cm (10 × 10 × 0.6 in). French uses Canadian style and decimal comma (1,5 cm).
- Keep URL structure unchanged unless asked; same trailing-slash format in links, canonical, hreflang and sitemap.
- New pages: add to sitemap, give JSON-LD where relevant, add both EN and FR text.

## Always follow: web accessibility (WCAG 2.2 AA)

- **Contrast ≥ 4.5:1** for text (3:1 for large text and UI borders). Never use `text-ink/70` or lower, or `text-amber` / light text on `bg-amber`, for small text (`ink/70` is only 4.1:1); use `ink/80`+, `amber-deep`, `charcoal`.
- **Touch targets ≥ 24×24 px** (aim for 44 px) with spacing; give inline links vertical padding (`inline-block py-2`).
- Meaningful `alt` on images (empty `alt=""` + `aria-hidden` for decoration); `<html lang>` matches the page language; `hrefLang` on language links.
- Use semantic HTML and landmarks, logical heading order, visible focus states, keyboard-reachable controls, descriptive link text.
- Don't convey information by colour alone; respect `prefers-reduced-motion`.

## Before finishing any change

Run `yarn typecheck` and `yarn build`. For SEO-touching changes, inspect `out/` HTML (canonical, hreflang, og:url, title/description length, no other domain). For UI changes, check contrast and touch-target size; Lighthouse accessibility should stay at 100.
