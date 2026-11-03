import type { ProductLocale } from "./types";

/** Storefront path of a category, with the trailing slash the site uses everywhere. */
export function categoryPath(locale: ProductLocale, slug: string): string {
  return `/${locale}/category/${slug}/`;
}
