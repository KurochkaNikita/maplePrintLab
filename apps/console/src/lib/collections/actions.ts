"use server";

import {
  createCollection as insertCollection,
  createDb,
  deleteCollection as removeCollection,
  findCollection,
  isCollectionSlugTaken,
  isUniqueViolation,
  updateCollection as writeCollection,
  type CollectionInput,
  type Db,
} from "@maple-print-lab/db";
import { requireAdmin } from "@/lib/auth/server";
import type { ActionResult, CollectionFormValues, DeleteResult, FieldErrors } from "./types";
import { validateCollection } from "./validation";

type Prepared = { input: CollectionInput; errors?: undefined } | { errors: FieldErrors; input?: undefined };

/** Validation plus the checks that need the database. */
async function prepare(db: Db, values: CollectionFormValues, currentId?: string): Promise<Prepared> {
  const result = validateCollection(values);
  const errors: FieldErrors = "errors" in result ? { ...result.errors } : {};

  const slug = values.slug.trim();
  if (slug && !errors.slug && (await isCollectionSlugTaken(db, slug, currentId))) errors.slug = { code: "slugTaken" };

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

export async function createCollection(values: CollectionFormValues): Promise<ActionResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };

  try {
    const db = createDb();
    const prepared = await prepare(db, values);
    if (prepared.errors) return { ok: false, errors: prepared.errors };
    return { ok: true, id: await insertCollection(db, prepared.input) };
  } catch (e) {
    // Lost a race with another admin creating the same slug.
    if (isUniqueViolation(e)) return { ok: false, errors: { slug: { code: "slugTaken" } } };
    console.error("createCollection failed", e);
    return { ok: false, formError: "unknown" };
  }
}

export async function updateCollection(id: string, values: CollectionFormValues): Promise<ActionResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };
  if (typeof id !== "string" || !id) return { ok: false, formError: "notFound" };

  try {
    const db = createDb();
    if (!(await findCollection(db, id))) return { ok: false, formError: "notFound" };
    const prepared = await prepare(db, values, id);
    if (prepared.errors) return { ok: false, errors: prepared.errors };
    return (await writeCollection(db, id, prepared.input))
      ? { ok: true, id: prepared.input.slug }
      : { ok: false, formError: "notFound" };
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: false, errors: { slug: { code: "slugTaken" } } };
    console.error("updateCollection failed", e);
    return { ok: false, formError: "unknown" };
  }
}

/** Deletes the collection; its products stay, only the links go. */
export async function deleteCollection(id: string): Promise<DeleteResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };
  if (typeof id !== "string" || !id) return { ok: false, formError: "notFound" };

  try {
    const result = await removeCollection(createDb(), id);
    return result.ok ? { ok: true } : { ok: false, formError: result.reason };
  } catch (e) {
    console.error("deleteCollection failed", e);
    return { ok: false, formError: "unknown" };
  }
}
