import { and, asc, count, desc, eq, ilike, inArray, like, max, ne, or, sql } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import type { Db } from "./client";
import {
  categories,
  categoryTranslations,
  collections,
  collectionTranslations,
  productCollections,
  productImages,
  productTranslations,
  products,
  redirects,
  type Dimensions,
  type Highlight,
  type PriceTier,
} from "./schema";
import { PRODUCT_LOCALES, productPath, type ProductLocale } from "./locales";

export { PRODUCT_LOCALES, productPath, type ProductLocale };

/** `file` is a Blob URL, or a bare file name under `public/product/<slug>/` for photos imported from the site. */
export type ProductImageInput = {
  file: string;
  width: number;
  height: number;
  /** Alt text per locale. */
  alts: Record<ProductLocale, string>;
};

export type ProductTextInput = {
  title: string;
  note: string;
  description: string;
  material: string;
  highlights: Highlight[];
  seoTitle: string;
  seoDescription: string;
};

/** A validated product, ready to be written. */
export type ProductInput = {
  slug: string;
  categoryId: string;
  collectionIds: string[];
  published: boolean;
  noindex: boolean;
  isNew: boolean;
  sortOrder: number;
  /** Null when the product has price tiers. */
  priceAmount: string | null;
  /** Volume pricing, or null for a single price. */
  priceTiers: PriceTier[] | null;
  priceFrom: boolean;
  /** Our cost of one piece, or null when not entered. */
  costAmount: string | null;
  dimensions: Dimensions;
  /** Main photo first; the position is the index. */
  images: ProductImageInput[];
  translations: Record<ProductLocale, ProductTextInput>;
};

export type ProductRecord = Omit<ProductInput, "translations" | "images"> & {
  images: { file: string; width: number; height: number; alts: Partial<Record<ProductLocale, string>> }[];
  id: number;
  updatedAt: Date;
  /** A locale is missing when its row was never created. */
  translations: Partial<Record<ProductLocale, ProductTextInput>>;
};

export type ProductListItem = {
  id: number;
  slug: string;
  title: string | null;
  categoryId: string;
  categoryTitle: string | null;
  /** English titles of the collections the product is in, alphabetical; empty when in none. */
  collectionTitles: string[];
  published: boolean;
  isNew: boolean;
  /** File name of the main photo (position 0) under `public/product/<slug>/` on the storefront. */
  imageFile: string | null;
  updatedAt: Date;
};

export type CategoryOption = { id: string; title: string };
export type CollectionOption = { id: string; title: string };

export type ProductSortKey = "title" | "collection" | "category";
export type SortDirection = "asc" | "desc";

export type ProductListPage = { items: ProductListItem[]; total: number; page: number; pageCount: number };

/** `%` and `_` typed by the admin must match literally inside ILIKE. */
const likePattern = (q: string) => `%${q.replace(/[\\%_]/g, "\\$&")}%`;

/**
 * One page of the catalogue, optionally filtered by a substring of the slug or of a title in any language,
 * and by category or collection.
 * `page` is 1-based and clamped to the last page, so a stale link never shows an empty page.
 */
export async function listProducts(
  db: Db,
  {
    query = "",
    page = 1,
    pageSize = 20,
    categoryId,
    collectionId,
    sort,
    dir = "asc",
  }: {
    query?: string;
    page?: number;
    pageSize?: number;
    categoryId?: string;
    collectionId?: string;
    /** Column to sort by; without it the catalogue keeps its manual order. */
    sort?: ProductSortKey;
    dir?: SortDirection;
  } = {},
): Promise<ProductListPage> {
  const q = query.trim();
  const pattern = likePattern(q);
  const search = q
    ? or(
        ilike(products.slug, pattern),
        sql`exists (select 1 from ${productTranslations} pt where pt.product_id = ${products.id} and pt.title ilike ${pattern})`,
      )
    : undefined;
  const inCollection =
    collectionId === undefined
      ? undefined
      : sql`exists (select 1 from ${productCollections} pc where pc.product_id = ${products.id} and pc.collection_id = ${collectionId})`;
  const where = and(
    search,
    categoryId === undefined ? undefined : eq(products.categoryId, categoryId),
    inCollection,
  );

  const [{ total }] = await db.select({ total: count() }).from(products).where(where);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pageCount);

  // English collection titles of a product, alphabetical, as a JSON array (parsed by the driver).
  const collectionTitles = sql<string[]>`coalesce((select json_agg(ct.title order by ct.title) from ${productCollections} pc join ${collectionTranslations} ct on ct.collection_id = pc.collection_id and ct.locale = 'en' where pc.product_id = ${products.id}), '[]'::json)`;
  // Products in no collection sort last in either direction, like missing titles.
  const sortExpr = {
    title: sql`lower(${productTranslations.title})`,
    category: sql`lower(${categoryTranslations.title})`,
    collection: sql`lower((select min(ct.title) from ${productCollections} pc join ${collectionTranslations} ct on ct.collection_id = pc.collection_id and ct.locale = 'en' where pc.product_id = ${products.id}))`,
  };
  const direction = dir === "desc" ? desc : asc;
  const orderBy = sort
    ? [sql`${direction(sortExpr[sort])} nulls last`, asc(products.sortOrder), asc(products.id)]
    : [asc(products.sortOrder), asc(products.id)];

  const items = await db
    .select({
      id: products.id,
      slug: products.slug,
      title: productTranslations.title,
      categoryId: products.categoryId,
      categoryTitle: categoryTranslations.title,
      collectionTitles,
      published: products.published,
      isNew: products.isNew,
      imageFile: productImages.file,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .leftJoin(productImages, and(eq(productImages.productId, products.id), eq(productImages.position, 0)))
    .leftJoin(
      productTranslations,
      and(eq(productTranslations.productId, products.id), eq(productTranslations.locale, "en")),
    )
    .leftJoin(
      categoryTranslations,
      and(eq(categoryTranslations.categoryId, products.categoryId), eq(categoryTranslations.locale, "en")),
    )
    .where(where)
    .orderBy(...orderBy)
    .limit(pageSize)
    .offset((current - 1) * pageSize);

  return { items, total, page: current, pageCount };
}

export async function findProduct(db: Db, id: number): Promise<ProductRecord | null> {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!row) return null;

  const [translationRows, linkRows, imageRows] = await Promise.all([
    db.select().from(productTranslations).where(eq(productTranslations.productId, id)),
    db
      .select({ collectionId: productCollections.collectionId })
      .from(productCollections)
      .where(eq(productCollections.productId, id)),
    db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(asc(productImages.position)),
  ]);

  const translations: ProductRecord["translations"] = {};
  for (const locale of PRODUCT_LOCALES) {
    const tr = translationRows.find((r) => r.locale === locale);
    if (tr) {
      translations[locale] = {
        title: tr.title,
        note: tr.note,
        description: tr.description,
        material: tr.material,
        highlights: tr.highlights,
        seoTitle: tr.seoTitle,
        seoDescription: tr.seoDescription,
      };
    }
  }

  return {
    id: row.id,
    slug: row.slug,
    categoryId: row.categoryId,
    collectionIds: linkRows.map((l) => l.collectionId),
    published: row.published,
    noindex: row.noindex,
    isNew: row.isNew,
    sortOrder: row.sortOrder,
    priceAmount: row.priceAmount,
    priceTiers: row.priceTiers,
    priceFrom: row.priceFrom,
    costAmount: row.costAmount,
    dimensions: row.dimensions,
    updatedAt: row.updatedAt,
    images: imageRows.map((img) => ({ file: img.file, width: img.width, height: img.height, alts: img.alts })),
    translations,
  };
}

export async function listCategoryOptions(db: Db): Promise<CategoryOption[]> {
  const rows = await db
    .select({ id: categories.id, title: categoryTranslations.title })
    .from(categories)
    .leftJoin(
      categoryTranslations,
      and(eq(categoryTranslations.categoryId, categories.id), eq(categoryTranslations.locale, "en")),
    )
    .orderBy(asc(categories.sortOrder), asc(categories.id));
  return rows.map((r) => ({ id: r.id, title: r.title ?? r.id }));
}

export async function listCollectionOptions(db: Db): Promise<CollectionOption[]> {
  const rows = await db
    .select({ id: collections.id, title: collectionTranslations.title })
    .from(collections)
    .leftJoin(
      collectionTranslations,
      and(eq(collectionTranslations.collectionId, collections.id), eq(collectionTranslations.locale, "en")),
    )
    .orderBy(asc(collections.sortOrder), asc(collections.id));
  return rows.map((r) => ({ id: r.id, title: r.title ?? r.id }));
}

/** The subset of `ids` that exist. */
export async function existingCollectionIds(db: Db, ids: string[]): Promise<string[]> {
  if (!ids.length) return [];
  const rows = await db.select({ id: collections.id }).from(collections).where(inArray(collections.id, ids));
  return rows.map((r) => r.id);
}

export async function isSlugTaken(db: Db, slug: string, exceptId?: number): Promise<boolean> {
  const [row] = await db
    .select({ id: products.id })
    .from(products)
    .where(exceptId === undefined ? eq(products.slug, slug) : and(eq(products.slug, slug), ne(products.id, exceptId)))
    .limit(1);
  return !!row;
}

/** Every photo `file` that is a full URL (a Blob upload), for telling stored photos from orphans. */
export async function listUploadedPhotoRefs(db: Db): Promise<string[]> {
  const rows = await db.select({ file: productImages.file }).from(productImages).where(like(productImages.file, "http%"));
  return rows.map((r) => r.file);
}

export async function nextProductSortOrder(db: Db): Promise<number> {
  const [row] = await db.select({ highest: max(products.sortOrder) }).from(products);
  return (row?.highest ?? -1) + 1;
}

function productRow(input: ProductInput) {
  return {
    slug: input.slug,
    categoryId: input.categoryId,
    isNew: input.isNew,
    published: input.published,
    noindex: input.noindex,
    sortOrder: input.sortOrder,
    priceAmount: input.priceAmount,
    priceTiers: input.priceTiers,
    priceFrom: input.priceFrom,
    costAmount: input.costAmount,
    dimensions: input.dimensions,
  };
}

function translationRows(productId: number | ReturnType<typeof sql<number>>, input: ProductInput) {
  return PRODUCT_LOCALES.map((locale) => ({ productId, locale, ...input.translations[locale] }));
}

function imageRows(productId: number | ReturnType<typeof sql<number>>, input: ProductInput) {
  return input.images.map((img, position) => ({ productId, position, ...img }));
}

function runBatch(db: Db, statements: BatchItem<"pg">[]) {
  return db.batch(statements as [BatchItem<"pg">, ...BatchItem<"pg">[]]);
}

/**
 * Inserts the product and its rows in one atomic batch (the neon-http driver has no
 * interactive transactions). The new id is not known up front, so the child rows
 * look it up by the unique slug.
 */
export async function createProduct(db: Db, input: ProductInput): Promise<number> {
  const productId = sql<number>`(select ${products.id} from ${products} where ${products.slug} = ${input.slug})`;
  const statements: BatchItem<"pg">[] = [
    db.insert(products).values(productRow(input)).returning({ id: products.id }),
    db.insert(productTranslations).values(translationRows(productId, input)),
  ];
  if (input.collectionIds.length) {
    statements.push(
      db.insert(productCollections).values(input.collectionIds.map((collectionId) => ({ productId, collectionId }))),
    );
  }
  if (input.images.length) statements.push(db.insert(productImages).values(imageRows(productId, input)));
  const [inserted] = await runBatch(db, statements);
  return (inserted as { id: number }[])[0].id;
}

/**
 * Replaces the product's translations and collection links and updates its row, atomically.
 * When the slug changes, old storefront URLs get permanent redirects (see `products.slug`).
 * Returns false when the product does not exist.
 */
export async function updateProduct(db: Db, id: number, input: ProductInput): Promise<boolean> {
  const [current] = await db.select({ slug: products.slug }).from(products).where(eq(products.id, id)).limit(1);
  if (!current) return false;

  const statements: BatchItem<"pg">[] = [
    db
      .update(products)
      .set({ ...productRow(input), updatedAt: new Date() })
      .where(eq(products.id, id)),
    db.delete(productTranslations).where(eq(productTranslations.productId, id)),
    db.insert(productTranslations).values(translationRows(id, input)),
    db.delete(productCollections).where(eq(productCollections.productId, id)),
    db.delete(productImages).where(eq(productImages.productId, id)),
  ];
  if (input.images.length) statements.push(db.insert(productImages).values(imageRows(id, input)));
  if (input.collectionIds.length) {
    statements.push(
      db
        .insert(productCollections)
        .values(input.collectionIds.map((collectionId) => ({ productId: id, collectionId }))),
    );
  }

  if (current.slug !== input.slug) {
    const from = PRODUCT_LOCALES.map((locale) => productPath(locale, current.slug));
    const to = PRODUCT_LOCALES.map((locale) => productPath(locale, input.slug));
    // Redirects *from* the new URLs would shadow the live pages, and any earlier redirect *from* the old
    // URLs is replaced by the one inserted below (so a plain insert cannot hit the primary key).
    statements.push(db.delete(redirects).where(inArray(redirects.fromPath, [...to, ...from])));
    PRODUCT_LOCALES.forEach((_, i) => {
      // Redirects that ended at the old URL now end at the new one (no chains).
      statements.push(
        db.update(redirects).set({ toPath: to[i], updatedAt: new Date() }).where(eq(redirects.toPath, from[i])),
      );
    });
    statements.push(db.insert(redirects).values(from.map((fromPath, i) => ({ fromPath, toPath: to[i], permanent: true }))));
  }

  await runBatch(db, statements);
  return true;
}

/** Changes only the published flag, leaving the rest of the product untouched. */
export async function setProductPublished(db: Db, id: number, published: boolean): Promise<boolean> {
  const rows = await db
    .update(products)
    .set({ published, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning({ id: products.id });
  return rows.length > 0;
}

/** Postgres unique_violation, bare or wrapped by drizzle's `DrizzleQueryError`. */
export function isUniqueViolation(e: unknown): boolean {
  const err = e as { code?: string; cause?: { code?: string } } | null;
  return err?.code === "23505" || err?.cause?.code === "23505";
}
