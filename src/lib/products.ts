import { locales, type Locale } from "@/lib/i18n";
import type { ProductCatalog, ProductCategory, ProductItem } from "@/data/products/types";

/** Slugs shown in the homepage "latest work" section — same across locales. */
export const FEATURED_SLUGS = [
  "articulated-dragon",
  "faceted-vase",
  "headphone-stand",
];

const loaders: Record<Locale, () => Promise<ProductCatalog>> = {
  en: () => import("@/data/products/en").then((m) => m.default),
  fr: () => import("@/data/products/fr").then((m) => m.default),
};

export function getProducts(locale: Locale): Promise<ProductCatalog> {
  return loaders[locale]();
}

/** Slugs are shared across locales, so any catalog can enumerate them. */
export function findProduct(
  catalog: ProductCatalog,
  slug: string,
): { item: ProductItem; category: ProductCategory } | null {
  for (const category of catalog) {
    const item = category.items.find((i) => i.slug === slug);
    if (item) return { item, category };
  }
  return null;
}

export function allProductSlugs(catalog: ProductCatalog): string[] {
  return catalog.flatMap((category) => category.items.map((item) => item.slug));
}

export async function generateProductStaticParams() {
  const catalog = await getProducts(locales[0]);
  const slugs = allProductSlugs(catalog);
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}
