import { locales, type Locale } from "@/lib/i18n";
import {
  createDb,
  loadStorefront,
  type Dimensions,
  type PriceTier,
  type SeoBlockJson as SeoBlock,
  type Storefront,
  type StorefrontProduct,
} from "@maple-print-lab/db";

/** Search-engine data for one page in one language. */
export type Seo = { title: string; description: string };

export type ResolvedImage = { src: string; width: number; height: number; alt: string };

/** Resolved, single-language shapes the pages render (built from `@maple-print-lab/db`). */
export type ProductItem = {
  slug: string;
  categoryId: string;
  /** Ids of the collections this product belongs to. */
  collectionIds: string[];
  title: string;
  note: string;
  price: { amount: number; currency: "CAD"; from?: boolean };
  /** Price falls with order size (`priceTiers`); `price` is then the lowest tier, shown as "From …/pc". */
  volumePricing: boolean;
  priceTiers?: PriceTier[];
  isNew: boolean;
  /** Page stays live but gets `noindex` and is left out of the sitemap. */
  noindex: boolean;
  updatedAt: Date;
  dimensions: Dimensions;
  material: string;
  description: string;
  highlights: { title: string; text: string }[];
  images: ResolvedImage[];
  seo: Seo;
};

export type ProductCollection = {
  id: string;
  title: string;
  intro: string;
  items: ProductItem[];
  seo: Seo;
};

export type ProductCategory = {
  id: string;
  title: string;
  intro: string;
  highlight?: string;
  items: ProductItem[];
  seo: Seo;
  seoBlock?: SeoBlock;
  customColours: boolean;
  updatedAt: Date;
};

export type ProductCatalog = ProductCategory[];

/**
 * Catalogue rows are read from Postgres once per build (the site is a static export). Needs `DATABASE_URL`
 * with read access; see `.env.example`.
 */
let storefront: Promise<Storefront> | undefined;

/**
 * Next.js caches `fetch` (which the Neon driver uses) on disk across builds and dev restarts, so a cached
 * answer would show old content after an edit in the console. `revalidate: 1` makes each entry expire at once
 * (`cache: "no-store"` would make the pages dynamic, which a static export refuses).
 */
const freshQueries = { next: { revalidate: 1 } } as RequestInit;

function loadCatalogue(): Promise<Storefront> {
  // `next dev` re-reads on every request so edits made in the console show up on refresh.
  if (process.env.NODE_ENV !== "production") return loadStorefront(createDb(undefined, freshQueries));
  storefront ??= loadStorefront(createDb(undefined, freshQueries));
  return storefront;
}

/** A photo `file` is a Blob URL, or a bare file name under `public/product/<slug>/`. */
const imageSrc = (slug: string, file: string) => (/^https?:\/\//.test(file) ? file : `/product/${slug}/${file}`);

function resolvePrice(product: StorefrontProduct): ProductItem["price"] {
  if (product.priceAmount !== null) {
    return { amount: product.priceAmount, currency: "CAD", ...(product.priceFrom && { from: true }) };
  }
  if (product.priceTiers?.length) {
    return { amount: Math.min(...product.priceTiers.map((t) => t.amount)), currency: "CAD", from: true };
  }
  throw new Error(`Product "${product.slug}" has neither a price nor priceTiers`);
}

/** Published categories that have a translation for `locale` and at least one published product to show. */
export async function getProducts(locale: Locale): Promise<ProductCatalog> {
  const data = await loadCatalogue();
  const catalog: ProductCategory[] = [];

  for (const category of data.categories) {
    const text = category.translations[locale];
    if (!text) continue;

    const items = data.products
      .filter((p) => p.categoryId === category.id && p.translations[locale])
      .map((p): ProductItem => {
        const t = p.translations[locale]!;
        return {
          slug: p.slug,
          categoryId: p.categoryId,
          collectionIds: [],
          title: t.title,
          note: t.note,
          price: resolvePrice(p),
          volumePricing: Boolean(p.priceTiers?.length),
          priceTiers: p.priceTiers ?? undefined,
          isNew: p.isNew,
          noindex: p.noindex,
          updatedAt: p.updatedAt,
          dimensions: p.dimensions,
          material: t.material,
          description: t.description,
          highlights: t.highlights,
          images: p.images.map((img) => ({
            src: imageSrc(p.slug, img.file),
            width: img.width,
            height: img.height,
            alt: img.alts[locale] ?? "",
          })),
          seo: { title: t.seoTitle, description: t.seoDescription },
        };
      });
    if (!items.length) continue;

    catalog.push({
      id: category.id,
      title: text.title,
      intro: text.intro,
      highlight: text.highlight ?? undefined,
      seo: { title: text.seoTitle, description: text.seoDescription },
      seoBlock: text.seoBlock ?? undefined,
      customColours: category.customColours,
      updatedAt: category.updatedAt,
      items,
    });
  }
  return catalog;
}

/** Products flagged `isNew`, for the homepage "Latest work" section, in display order. */
export function getNewItems(catalog: ProductCatalog): ProductItem[] {
  return catalog.flatMap((c) => c.items).filter((i) => i.isNew);
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

/**
 * Collections are hidden for now: no collection pages, links or sitemap entries. Flip
 * make `getCollections` and `generateCollectionStaticParams` read the `collections` tables of
 * `@maple-print-lab/db` to bring them back.
 */
export function getCollections(_catalog: ProductCatalog, _locale: Locale): ProductCollection[] {
  return [];
}

export function findCollection(collections: ProductCollection[], id: string): ProductCollection | undefined {
  return collections.find((c) => c.id === id);
}

export async function generateCollectionStaticParams() {
  return [];
}
