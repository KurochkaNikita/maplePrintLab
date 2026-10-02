import { locales, type Locale } from "@/lib/i18n";
import { categories, products, type Seo, type SeoBlock } from "@/db";

/** Resolved, single-language shapes the pages render (joined from `@/db`). */
export type ProductItem = {
  slug: string;
  categoryId: string;
  title: string;
  note: string;
  price: { amount: number; currency: "CAD"; from?: boolean };
  sizes: string[];
  description: string;
  imageCount: number;
  seo: Seo;
};

export type ProductCategory = {
  id: string;
  title: string;
  intro: string;
  items: ProductItem[];
  seo: Seo;
  seoBlock?: SeoBlock;
};

export type ProductCatalog = ProductCategory[];

export function getProducts(locale: Locale): Promise<ProductCatalog> {
  return Promise.resolve(
    categories.map((category) => {
      const { title, intro, seo, seoBlock } = category.translations[locale];
      const items = products
        .filter((p) => p.categoryId === category.id)
        .map((p): ProductItem => {
          const t = p.translations[locale];
          return {
            slug: p.slug,
            categoryId: p.categoryId,
            title: t.title,
            note: t.note,
            price: p.price,
            sizes: t.sizes,
            description: t.description,
            imageCount: p.imageCount,
            seo: t.seo,
          };
        });
      return { id: category.id, title, intro, seo, seoBlock, items };
    }),
  );
}

/** Featured products for the homepage, in table order. */
export function getFeaturedItems(catalog: ProductCatalog): ProductItem[] {
  return products
    .filter((p) => p.featured)
    .map((p) => findProduct(catalog, p.slug)?.item)
    .filter((item): item is ProductItem => item !== undefined);
}

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

export function findCategory(
  catalog: ProductCatalog,
  id: string,
): ProductCategory | undefined {
  return catalog.find((category) => category.id === id);
}

export function allProductSlugs(catalog: ProductCatalog): string[] {
  return catalog.flatMap((category) => category.items.map((item) => item.slug));
}

/** Slugs and category ids are shared across locales, so any catalog can enumerate them. */
export async function generateProductStaticParams() {
  const catalog = await getProducts(locales[0]);
  const slugs = allProductSlugs(catalog);
  return locales.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateCategoryStaticParams() {
  const catalog = await getProducts(locales[0]);
  return locales.flatMap((lang) => catalog.map((c) => ({ lang, id: c.id })));
}
