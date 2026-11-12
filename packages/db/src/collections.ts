import { and, asc, count, eq, ilike, inArray, ne, or, sql } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import type { Db } from "./client";
import { collections, collectionTranslations, productCollections, redirects } from "./schema";
import { PRODUCT_LOCALES, type ProductLocale } from "./locales";
import { productsIndexPath } from "./categories";

export type CollectionTextInput = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
};

/** A validated collection, ready to be written. `slug` is the primary key and the URL segment. */
export type CollectionInput = {
  slug: string;
  published: boolean;
  sortOrder: number;
  translations: Record<ProductLocale, CollectionTextInput>;
};

export type CollectionRecord = Omit<CollectionInput, "translations"> & {
  updatedAt: Date;
  /** A locale is missing when its row was never created. */
  translations: Partial<Record<ProductLocale, CollectionTextInput>>;
};

export type CollectionListItem = {
  id: string;
  title: string | null;
  productCount: number;
  published: boolean;
  sortOrder: number;
  updatedAt: Date;
};

export type CollectionListPage = { items: CollectionListItem[]; total: number; page: number; pageCount: number };

/** Path on the storefront, with the trailing slash the site uses everywhere. */
export function collectionPath(locale: ProductLocale, slug: string): string {
  return `/${locale}/collection/${slug}/`;
}

/** `%` and `_` typed by the admin must match literally inside ILIKE. */
const likePattern = (q: string) => `%${q.replace(/[\\%_]/g, "\\$&")}%`;

function runBatch(db: Db, statements: BatchItem<"pg">[]) {
  return db.batch(statements as [BatchItem<"pg">, ...BatchItem<"pg">[]]);
}

/**
 * One page of collections with their product counts, optionally filtered by a substring of the slug or of
 * a title in any language. `page` is 1-based and clamped to the last page.
 */
export async function listCollections(
  db: Db,
  { query = "", page = 1, pageSize = 20 }: { query?: string; page?: number; pageSize?: number } = {},
): Promise<CollectionListPage> {
  const q = query.trim();
  const pattern = likePattern(q);
  const where = q
    ? or(
        ilike(collections.id, pattern),
        sql`exists (select 1 from ${collectionTranslations} ct where ct.collection_id = ${collections.id} and ct.title ilike ${pattern})`,
      )
    : undefined;

  const [{ total }] = await db.select({ total: count() }).from(collections).where(where);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pageCount);

  const rows = await db
    .select({
      id: collections.id,
      title: collectionTranslations.title,
      published: collections.published,
      sortOrder: collections.sortOrder,
      updatedAt: collections.updatedAt,
    })
    .from(collections)
    .leftJoin(
      collectionTranslations,
      and(eq(collectionTranslations.collectionId, collections.id), eq(collectionTranslations.locale, "en")),
    )
    .where(where)
    .orderBy(asc(collections.sortOrder), asc(collections.id))
    .limit(pageSize)
    .offset((current - 1) * pageSize);

  const counts = rows.length
    ? await db
        .select({ collectionId: productCollections.collectionId, total: count() })
        .from(productCollections)
        .where(inArray(productCollections.collectionId, rows.map((r) => r.id)))
        .groupBy(productCollections.collectionId)
    : [];
  const countOf = new Map(counts.map((c) => [c.collectionId, c.total]));

  return {
    items: rows.map((r) => ({ ...r, productCount: countOf.get(r.id) ?? 0 })),
    total,
    page: current,
    pageCount,
  };
}

export async function findCollection(db: Db, id: string): Promise<CollectionRecord | null> {
  const [row] = await db.select().from(collections).where(eq(collections.id, id)).limit(1);
  if (!row) return null;

  const translationRows = await db
    .select()
    .from(collectionTranslations)
    .where(eq(collectionTranslations.collectionId, id));

  const translations: CollectionRecord["translations"] = {};
  for (const locale of PRODUCT_LOCALES) {
    const tr = translationRows.find((r) => r.locale === locale);
    if (tr) {
      translations[locale] = {
        title: tr.title,
        intro: tr.intro,
        seoTitle: tr.seoTitle,
        seoDescription: tr.seoDescription,
      };
    }
  }

  return {
    slug: row.id,
    published: row.published,
    sortOrder: row.sortOrder,
    updatedAt: row.updatedAt,
    translations,
  };
}

export async function isCollectionSlugTaken(db: Db, slug: string, exceptId?: string): Promise<boolean> {
  const [row] = await db
    .select({ id: collections.id })
    .from(collections)
    .where(
      exceptId === undefined ? eq(collections.id, slug) : and(eq(collections.id, slug), ne(collections.id, exceptId)),
    )
    .limit(1);
  return !!row;
}

export async function nextCollectionSortOrder(db: Db): Promise<number> {
  const [row] = await db.select({ highest: sql<number | null>`max(${collections.sortOrder})` }).from(collections);
  return (row?.highest ?? -1) + 1;
}

function collectionRow(input: CollectionInput) {
  return { published: input.published, sortOrder: input.sortOrder };
}

function translationRows(collectionId: string, input: CollectionInput) {
  return PRODUCT_LOCALES.map((locale) => ({ collectionId, locale, ...input.translations[locale] }));
}

/** Inserts the collection and its translations in one atomic batch. The slug is the primary key, so it is known up front. */
export async function createCollection(db: Db, input: CollectionInput): Promise<string> {
  await runBatch(db, [
    // A redirect left by an earlier delete or rename would hide the new live pages.
    db
      .delete(redirects)
      .where(inArray(redirects.fromPath, PRODUCT_LOCALES.map((locale) => collectionPath(locale, input.slug)))),
    db.insert(collections).values({ id: input.slug, ...collectionRow(input) }),
    db.insert(collectionTranslations).values(translationRows(input.slug, input)),
  ]);
  return input.slug;
}

/**
 * Updates the collection and replaces its translations, atomically. When the slug changes, the
 * `ON UPDATE CASCADE` keys follow it (product links, translations) and old storefront URLs get permanent redirects.
 * Returns false when the collection does not exist.
 */
export async function updateCollection(db: Db, id: string, input: CollectionInput): Promise<boolean> {
  const [current] = await db.select({ id: collections.id }).from(collections).where(eq(collections.id, id)).limit(1);
  if (!current) return false;
  const slug = input.slug;

  const statements: BatchItem<"pg">[] = [
    db
      .update(collections)
      .set({ id: slug, ...collectionRow(input), updatedAt: new Date() })
      .where(eq(collections.id, id)),
    db.delete(collectionTranslations).where(eq(collectionTranslations.collectionId, slug)),
    db.insert(collectionTranslations).values(translationRows(slug, input)),
  ];

  if (id !== slug) {
    const from = PRODUCT_LOCALES.map((locale) => collectionPath(locale, id));
    const to = PRODUCT_LOCALES.map((locale) => collectionPath(locale, slug));
    // Same rules as a category slug change: no redirect from a live URL, no chains.
    statements.push(db.delete(redirects).where(inArray(redirects.fromPath, [...to, ...from])));
    PRODUCT_LOCALES.forEach((_, i) => {
      statements.push(
        db.update(redirects).set({ toPath: to[i], updatedAt: new Date() }).where(eq(redirects.toPath, from[i])),
      );
    });
    statements.push(db.insert(redirects).values(from.map((fromPath, i) => ({ fromPath, toPath: to[i], permanent: true }))));
  }

  await runBatch(db, statements);
  return true;
}

/** How many products belong to the collection. */
export async function countCollectionProducts(db: Db, id: string): Promise<number> {
  const [row] = await db.select({ total: count() }).from(productCollections).where(eq(productCollections.collectionId, id));
  return row?.total ?? 0;
}

export type DeleteCollectionResult = { ok: true } | { ok: false; reason: "notFound" };

/**
 * Deletes a collection; the links to its products go with it (`ON DELETE CASCADE`), the products stay.
 * Its old storefront URLs redirect to the product list.
 */
export async function deleteCollection(db: Db, id: string): Promise<DeleteCollectionResult> {
  const [current] = await db.select({ id: collections.id }).from(collections).where(eq(collections.id, id)).limit(1);
  if (!current) return { ok: false, reason: "notFound" };

  const from = PRODUCT_LOCALES.map((locale) => collectionPath(locale, id));

  await runBatch(db, [
    db.delete(collections).where(eq(collections.id, id)),
    db.delete(redirects).where(inArray(redirects.fromPath, from)),
    db.insert(redirects).values(
      from.map((fromPath, i) => ({ fromPath, toPath: productsIndexPath(PRODUCT_LOCALES[i]), permanent: true })),
    ),
  ]);
  return { ok: true };
}
