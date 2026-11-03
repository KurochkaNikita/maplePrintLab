"use server";

import {
  createCategory as insertCategory,
  createDb,
  deleteCategory as removeCategory,
  findCategory,
  isCategorySlugTaken,
  isUniqueViolation,
  updateCategory as writeCategory,
  type CategoryInput,
  type Db,
} from "@maple-print-lab/db";
import { requireAdmin } from "@/lib/auth/server";
import type { ActionResult, CategoryFormValues, DeleteResult, FieldErrors } from "./types";
import { validateCategory } from "./validation";

type Prepared = { input: CategoryInput; errors?: undefined } | { errors: FieldErrors; input?: undefined };

/** Validation plus the checks that need the database. */
async function prepare(db: Db, values: CategoryFormValues, currentId?: string): Promise<Prepared> {
  const result = validateCategory(values);
  const errors: FieldErrors = "errors" in result ? { ...result.errors } : {};

  const slug = values.slug.trim();
  if (slug && !errors.slug && (await isCategorySlugTaken(db, slug, currentId))) errors.slug = { code: "slugTaken" };

  if (Object.keys(errors).length || "errors" in result) return { errors };
  return { input: result.input };
}

// Layouts do not re-run on client-side navigation, so each action checks access itself.
async function allowed(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

export async function createCategory(values: CategoryFormValues): Promise<ActionResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };

  try {
    const db = createDb();
    const prepared = await prepare(db, values);
    if (prepared.errors) return { ok: false, errors: prepared.errors };
    return { ok: true, id: await insertCategory(db, prepared.input) };
  } catch (e) {
    // Lost a race with another admin creating the same slug.
    if (isUniqueViolation(e)) return { ok: false, errors: { slug: { code: "slugTaken" } } };
    console.error("createCategory failed", e);
    return { ok: false, formError: "unknown" };
  }
}

export async function updateCategory(id: string, values: CategoryFormValues): Promise<ActionResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };
  if (typeof id !== "string" || !id) return { ok: false, formError: "notFound" };

  try {
    const db = createDb();
    const current = await findCategory(db, id);
    if (!current) return { ok: false, formError: "notFound" };
    // The fallback category keeps its slug: products and the migration refer to it.
    const submitted = current.isDefault ? { ...values, slug: current.slug } : values;
    const prepared = await prepare(db, submitted, id);
    if (prepared.errors) return { ok: false, errors: prepared.errors };
    return (await writeCategory(db, id, prepared.input))
      ? { ok: true, id: prepared.input.slug }
      : { ok: false, formError: "notFound" };
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: false, errors: { slug: { code: "slugTaken" } } };
    console.error("updateCategory failed", e);
    return { ok: false, formError: "unknown" };
  }
}

/** Moves the category's products to the fallback category, then deletes it. */
export async function deleteCategory(id: string): Promise<DeleteResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };
  if (typeof id !== "string" || !id) return { ok: false, formError: "notFound" };

  try {
    const result = await removeCategory(createDb(), id);
    return result.ok ? { ok: true } : { ok: false, formError: result.reason };
  } catch (e) {
    console.error("deleteCategory failed", e);
    return { ok: false, formError: "unknown" };
  }
}
