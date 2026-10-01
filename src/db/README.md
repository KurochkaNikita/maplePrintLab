# Content database

Typed tables for everything the site sells. Nothing outside `src/lib/products.ts` reads these files directly.

| File            | Table      | Links to                                  |
| --------------- | ---------- | ----------------------------------------- |
| `categories.ts` | categories | —                                         |
| `products.ts`   | products   | `categoryId` → categories |

- **Shared once:** category, price, photo count, featured flag. A category's product list is derived from `categoryId`, so there is nothing to keep in sync.
- **Per language** (`translations.en` / `translations.fr`): text plus `seo` (`title`, `description`, `keywords`). A missing language fails `yarn typecheck`.
- **Order** of records in a file is the display order.
- **Add a product:** append to `products.ts`. **Add a category:** append to `categories.ts`, then point products at its `id`. Pages, sitemap and carousel pick them up automatically.
- **Add a language:** add it to `locales` in `src/lib/i18n.ts`, then fill the new key everywhere TypeScript points.
