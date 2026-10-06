import { locales, type Locale } from "@/lib/i18n";
import { categories, products, type Dimensions, type PriceTier, type Seo, type SeoBlock } from "@/db";

export type ResolvedImage = { src: string; width: number; height: number; alt: string };

/** Resolved, single-language shapes the pages render (joined from `@/db`). */
export type ProductItem = {
  slug: string;
  categoryId: string;
  title: string;
  note: string;
  price: { amount: number; currency: "CAD"; from?: boolean };
  /** Price falls with order size (category `priceTiers`); `price` is then the lowest tier, shown as "From …/pc". */
  volumePricing: boolean;
  dimensions: Dimensions;
  material: string;
  description: string;
  images: ResolvedImage[];
  seo: Seo;
};

export type ProductCategory = {
  id: string;
  title: string;
  intro: string;
  highlight?: string;
  priceTiers?: PriceTier[];
  items: ProductItem[];
  seo: Seo;
  seoBlock?: SeoBlock;
  customColours: boolean;
};

export type ProductCatalog = ProductCategory[];

function resolvePrice(
  product: { slug: string; price?: ProductItem["price"] },
  categoryId: string,
  priceTiers?: PriceTier[],
): ProductItem["price"] {
  if (product.price) return product.price;
  if (priceTiers?.length) return { amount: Math.min(...priceTiers.map((t) => t.amount)), currency: "CAD", from: true };
  throw new Error(`Product "${product.slug}" has no price and category "${categoryId}" has no priceTiers`);
}

export function getProducts(locale: Locale): Promise<ProductCatalog> {
  return Promise.resolve(
    categories.map((category) => {
      const { title, intro, highlight, seo, seoBlock } = category.translations[locale];
      const { priceTiers } = category;
      const items = products
        .filter((p) => p.categoryId === category.id)
        .map((p): ProductItem => {
          const t = p.translations[locale];
          return {
            slug: p.slug,
            categoryId: p.categoryId,
            title: t.title,
            note: t.note,
            price: resolvePrice(p, category.id, priceTiers),
            volumePricing: Boolean(priceTiers?.length),
            dimensions: p.dimensions,
            material: p.material[locale],
            description: t.description,
            images: p.images.map((img, i) => ({
              src: `/product/${p.slug}/${img.file}`,
              width: img.width,
              height: img.height,
              alt: t.imageAlts[i] ?? "",
            })),
            seo: t.seo,
          };
        });
      return { id: category.id, title, intro, highlight, seo, seoBlock, customColours: category.customColours ?? false, priceTiers, items };
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
