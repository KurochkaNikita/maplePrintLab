"use server";

import {
  createDb,
  createProduct as insertProduct,
  existingCollectionIds,
  getCategoryPricing,
  isSlugTaken,
  isUniqueViolation,
  updateProduct as writeProduct,
  type Db,
  type ProductInput,
} from "@maple-print-lab/db";
import { requireAdmin } from "@/lib/auth/server";
import type { ActionResult, FieldErrors, ProductFormValues } from "./types";
import { validateProduct } from "./validation";

type Prepared = { input: ProductInput; errors?: undefined } | { errors: FieldErrors; input?: undefined };

/** Validation plus the checks that need the database. */
async function prepare(db: Db, values: ProductFormValues, productId?: number): Promise<Prepared> {
  const category = values.categoryId ? await getCategoryPricing(db, values.categoryId.trim()) : null;
  const result = validateProduct(values, {
    categoryExists: !!category,
    categoryHasPriceTiers: category?.hasPriceTiers ?? false,
  });
  const errors: FieldErrors = "errors" in result ? { ...result.errors } : {};

  const slug = values.slug.trim();
  if (slug && !errors.slug && (await isSlugTaken(db, slug, productId))) errors.slug = { code: "slugTaken" };

  const wanted = [...new Set(values.collectionIds)];
  const found = new Set(await existingCollectionIds(db, wanted));
  if (wanted.some((id) => !found.has(id))) errors.collectionIds = { code: "unknownCollection" };

  if (Object.keys(errors).length || "errors" in result) return { errors };
  return { input: result.input };
}

// Layouts do not re-run on client-side navigation, so each action checks access itself.
// A lost session (or a revoked admin flag) becomes a message the form can show.
async function guard(): Promise<ActionResult | null> {
  try {
    await requireAdmin();
    return null;
  } catch {
    return { ok: false, formError: "forbidden" };
  }
}

export async function createProduct(values: ProductFormValues): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  try {
    const db = createDb();
    const prepared = await prepare(db, values);
    if (prepared.errors) return { ok: false, errors: prepared.errors };
    return { ok: true, id: await insertProduct(db, prepared.input) };
  } catch (e) {
    // Lost a race with another admin creating the same slug.
    if (isUniqueViolation(e)) return { ok: false, errors: { slug: { code: "slugTaken" } } };
    console.error("createProduct failed", e);
    return { ok: false, formError: "unknown" };
  }
}

export async function updateProduct(id: number, values: ProductFormValues): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;
  if (!Number.isInteger(id) || id <= 0) return { ok: false, formError: "notFound" };

  try {
    const db = createDb();
    const prepared = await prepare(db, values, id);
    if (prepared.errors) return { ok: false, errors: prepared.errors };
    return (await writeProduct(db, id, prepared.input)) ? { ok: true, id } : { ok: false, formError: "notFound" };
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: false, errors: { slug: { code: "slugTaken" } } };
    console.error("updateProduct failed", e);
    return { ok: false, formError: "unknown" };
  }
}
