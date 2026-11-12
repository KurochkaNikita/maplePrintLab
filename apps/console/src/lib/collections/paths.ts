import type { ProductLocale } from "./types";

/** Storefront path of a collection, with the trailing slash the site uses everywhere. */
export function collectionPath(locale: ProductLocale, slug: string): string {
  return `/${locale}/collection/${slug}/`;
}
