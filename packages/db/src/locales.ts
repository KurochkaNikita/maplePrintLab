// No imports on purpose: client components import this file directly
// (`@maple-print-lab/db/src/locales`) so the database driver stays out of the browser bundle.

/** Storefront languages: one `product_translations` row each, and one redirect each when a slug changes. */
export const PRODUCT_LOCALES = ["en", "fr"] as const;
export type ProductLocale = (typeof PRODUCT_LOCALES)[number];

/** Path on the storefront, with the trailing slash the site uses everywhere. */
export function productPath(locale: ProductLocale, slug: string): string {
  return `/${locale}/product/${slug}/`;
}
