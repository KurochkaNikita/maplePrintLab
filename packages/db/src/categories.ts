import { and, asc, count, eq, ilike, inArray, ne, or, sql } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import type { Db } from "./client";
import {
  categories,
  categoryTranslations,
  products,
  redirects,
  type CategoryCover,
  type SeoBlockJson,
} from "./schema";
import { PRODUCT_LOCALES, type ProductLocale } from "./locales";

export type CategoryTextInput = {
  title: string;
  intro: string;
  /** Short key condition shown as a badge under the intro. */
  highlight: string | null;
  seoTitle: string;
  seoDescription: string;
  seoBlock: SeoBlockJson | null;
};

/** A validated category, ready to be written. `slug` is the primary key and the URL segment. */
export type CategoryInput = {
  slug: string;
  published: boolean;
  sortOrder: number;
  cover: CategoryCover | null;
  translations: Record<ProductLocale, CategoryTextInput>;
};

export type CategoryRecord = Omit<CategoryInput, "translations"> & {
  isDefault: boolean;
  updatedAt: Date;
  /** A locale is missing when its row was never created. */
  translations: Partial<Record<ProductLocale, CategoryTextInput>>;
};

export type CategoryListItem = {
  id: string;
  title: string | null;
  productCount: number;
  published: boolean;
  isDefault: boolean;
  sortOrder: number;
  updatedAt: Date;
};

export type CategoryListPage = { items: CategoryListItem[]; total: number; page: number; pageCount: number };

/** Path on the storefront, with the trailing slash the site uses everywhere. */
export function categoryPath(locale: ProductLocale, slug: string): string {
  return `/${locale}/category/${slug}/`;
}

/** Where visitors of a deleted category land. */
export function productsIndexPath(locale: ProductLocale): string {
  return `/${locale}/products/`;
}

/** `%` and `_` typed by the admin must match literally inside ILIKE. */
const likePattern = (q: string) => `%${q.replace(/[\\%_]/g, "\\$&")}%`;

function runBatch(db: Db, statements: BatchItem<"pg">[]) {
  return db.batch(statements as [BatchItem<"pg">, ...BatchItem<"pg">[]]);
}

/**
 * One page of categories with their product counts, optionally filtered by a substring of the slug or of
 * a title in any language. `page` is 1-based and clamped to the last page.
 */
export async function listCategories(
  db: Db,
  { query = "", page = 1, pageSize = 20 }: { query?: string; page?: number; pageSize?: number } = {},
): Promise<CategoryListPage> {
  const q = query.trim();
  const pattern = likePattern(q);
  const where = q
    ? or(
        ilike(categories.id, pattern),
        sql`exists (select 1 from ${categoryTranslations} ct where ct.category_id = ${categories.id} and ct.title ilike ${pattern})`,
      )
    : undefined;

  const [{ total }] = await db.select({ total: count() }).from(categories).where(where);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pageCount);

  const rows = await db
    .select({
      id: categories.id,
      title: categoryTranslations.title,
      published: categories.published,
      isDefault: categories.isDefault,
      sortOrder: categories.sortOrder,
      updatedAt: categories.updatedAt,
    })
    .from(categories)
    .leftJoin(
      categoryTranslations,
      and(eq(categoryTranslations.categoryId, categories.id), eq(categoryTranslations.locale, "en")),
    )
    .where(where)
    .orderBy(asc(categories.sortOrder), asc(categories.id))
    .limit(pageSize)
    .offset((current - 1) * pageSize);

  const counts = rows.length
    ? await db
        .select({ categoryId: products.categoryId, total: count() })
        .from(products)
        .where(inArray(products.categoryId, rows.map((r) => r.id)))
        .groupBy(products.categoryId)
    : [];
  const countOf = new Map(counts.map((c) => [c.categoryId, c.total]));

  return {
    items: rows.map((r) => ({ ...r, productCount: countOf.get(r.id) ?? 0 })),
    total,
    page: current,
    pageCount,
  };
}

export async function findCategory(db: Db, id: string): Promise<CategoryRecord | null> {
  const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  if (!row) return null;

  const translationRows = await db
    .select()
    .from(categoryTranslations)
    .where(eq(categoryTranslations.categoryId, id));

  const translations: CategoryRecord["translations"] = {};
  for (const locale of PRODUCT_LOCALES) {
    const tr = translationRows.find((r) => r.locale === locale);
    if (tr) {
      translations[locale] = {
        title: tr.title,
        intro: tr.intro,
        highlight: tr.highlight,
        seoTitle: tr.seoTitle,
        seoDescription: tr.seoDescription,
        seoBlock: tr.seoBlock,
      };
    }
  }

  return {
    slug: row.id,
    published: row.published,
    sortOrder: row.sortOrder,
    cover: row.cover,
    isDefault: row.isDefault,
    updatedAt: row.updatedAt,
    translations,
  };
}

export async function categoryExists(db: Db, id: string): Promise<boolean> {
  const [row] = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, id)).limit(1);
  return !!row;
}

export async function isCategorySlugTaken(db: Db, slug: string, exceptId?: string): Promise<boolean> {
  const [row] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(exceptId === undefined ? eq(categories.id, slug) : and(eq(categories.id, slug), ne(categories.id, exceptId)))
    .limit(1);
  return !!row;
}

export async function nextCategorySortOrder(db: Db): Promise<number> {
  // The fallback category sits last by design, so new categories are numbered after the others.
  const [row] = await db
    .select({ highest: sql<number | null>`max(${categories.sortOrder})` })
    .from(categories)
    .where(eq(categories.isDefault, false));
  return (row?.highest ?? -1) + 1;
}

/** The id of the fallback category, or null when the migration that creates it has not run. */
export async function getDefaultCategoryId(db: Db): Promise<string | null> {
  const [row] = await db.select({ id: categories.id }).from(categories).where(eq(categories.isDefault, true)).limit(1);
  return row?.id ?? null;
}

/** Every cover `file` that is a full URL (a Blob upload), for telling stored photos from orphans. */
export async function listUploadedCoverRefs(db: Db): Promise<string[]> {
  const rows = await db.select({ cover: categories.cover }).from(categories);
  return rows.flatMap((r) => (r.cover && r.cover.file.startsWith("http") ? [r.cover.file] : []));
}

function categoryRow(input: CategoryInput) {
  return {
    published: input.published,
    sortOrder: input.sortOrder,
    cover: input.cover,
  };
}

function translationRows(categoryId: string, input: CategoryInput) {
  return PRODUCT_LOCALES.map((locale) => ({ categoryId, locale, ...input.translations[locale] }));
}

/** Inserts the category and its translations in one atomic batch. The slug is the primary key, so it is known up front. */
export async function createCategory(db: Db, input: CategoryInput): Promise<string> {
  await runBatch(db, [
    // A redirect left by an earlier delete or rename would hide the new live pages.
    db.delete(redirects).where(inArray(redirects.fromPath, PRODUCT_LOCALES.map((locale) => categoryPath(locale, input.slug)))),
    db.insert(categories).values({ id: input.slug, ...categoryRow(input) }),
    db.insert(categoryTranslations).values(translationRows(input.slug, input)),
  ]);
  return input.slug;
}

/**
 * Updates the category and replaces its translations, atomically. When the slug changes, the
 * `ON UPDATE CASCADE` keys follow it (products, translations) and old storefront URLs get permanent redirects.
 * Returns false when the category does not exist. The fallback category keeps its slug.
 */
export async function updateCategory(db: Db, id: string, input: CategoryInput): Promise<boolean> {
  const [current] = await db
    .select({ id: categories.id, isDefault: categories.isDefault })
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  if (!current) return false;
  const slug = current.isDefault ? current.id : input.slug;

  const statements: BatchItem<"pg">[] = [
    db
      .update(categories)
      .set({ id: slug, ...categoryRow(input), updatedAt: new Date() })
      .where(eq(categories.id, id)),
    db.delete(categoryTranslations).where(eq(categoryTranslations.categoryId, slug)),
    db.insert(categoryTranslations).values(translationRows(slug, { ...input, slug })),
  ];

  if (id !== slug) {
    const from = PRODUCT_LOCALES.map((locale) => categoryPath(locale, id));
    const to = PRODUCT_LOCALES.map((locale) => categoryPath(locale, slug));
    // Same rules as a product slug change: no redirect from a live URL, no chains.
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

export type DeleteCategoryResult =
  | { ok: true; movedProducts: number }
  | { ok: false; reason: "notFound" | "isDefault" | "noDefault" };

/** How many products would move to the fallback category if `id` were deleted. */
export async function countCategoryProducts(db: Db, id: string): Promise<number> {
  const [row] = await db.select({ total: count() }).from(products).where(eq(products.categoryId, id));
  return row?.total ?? 0;
}

/**
 * Deletes a category after moving its products to the fallback one (one atomic batch). Its old storefront
 * URLs redirect to the product list. The fallback category itself cannot be deleted.
 */
export async function deleteCategory(db: Db, id: string): Promise<DeleteCategoryResult> {
  const [current] = await db
    .select({ isDefault: categories.isDefault })
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  if (!current) return { ok: false, reason: "notFound" };
  if (current.isDefault) return { ok: false, reason: "isDefault" };

  const fallbackId = await getDefaultCategoryId(db);
  if (!fallbackId) return { ok: false, reason: "noDefault" };

  const movedProducts = await countCategoryProducts(db, id);
  const from = PRODUCT_LOCALES.map((locale) => categoryPath(locale, id));

  await runBatch(db, [
    db.update(products).set({ categoryId: fallbackId, updatedAt: new Date() }).where(eq(products.categoryId, id)),
    db.delete(categories).where(and(eq(categories.id, id), eq(categories.isDefault, false))),
    db.delete(redirects).where(inArray(redirects.fromPath, from)),
    db.insert(redirects).values(
      from.map((fromPath, i) => ({ fromPath, toPath: productsIndexPath(PRODUCT_LOCALES[i]), permanent: true })),
    ),
  ]);
  return { ok: true, movedProducts };
}
