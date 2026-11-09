"use server";

import {
  createDb,
  createExpense as insertExpense,
  createFinanceOption,
  createOrder as insertOrder,
  deleteExpense as removeExpense,
  deleteFinanceOption,
  deleteOrder as removeOrder,
  financeOptionExists,
  productExists,
  renameFinanceOption,
  updateExpense as writeExpense,
  updateOrder as writeOrder,
  type FinanceOptionKind,
} from "@maple-print-lab/db";
import { requireAdmin } from "@/lib/auth/server";
import {
  OPTION_NAME_MAX,
  type DeleteResult,
  type ExpenseFormValues,
  type OptionResult,
  type OrderFormValues,
  type SaveResult,
} from "./types";
import { validateExpense, validateOrder } from "./validation";

// Layouts do not re-run on client-side navigation, so every action checks access itself.
async function allowed(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

const isUuid = (id: unknown): id is string =>
  typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
const isRowId = (id: unknown): id is number => typeof id === "number" && Number.isSafeInteger(id) && id > 0;

// ---- Orders ----------------------------------------------------------------

/** Validates against the real database: the client payload is untrusted. */
async function prepareOrder(values: OrderFormValues) {
  const db = createDb();
  const channelId = /^\d+$/.test(values.channelId.trim()) ? Number(values.channelId) : NaN;
  const productIds = [
    ...new Set(values.items.map((i) => (/^\d+$/.test(i.productId.trim()) ? Number(i.productId) : NaN)).filter(Number.isSafeInteger)),
  ];
  const [channelExists, existingProducts] = await Promise.all([
    Number.isSafeInteger(channelId) ? financeOptionExists(db, "channel", channelId) : false,
    Promise.all(productIds.map(async (id) => ((await productExists(db, id)) ? id : null))),
  ]);
  const known = new Set(existingProducts.filter((id): id is number => id !== null));
  return { db, result: validateOrder(values, { channelExists, productExists: (id) => known.has(id) }) };
}

export async function createOrder(values: OrderFormValues): Promise<SaveResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };
  try {
    const { db, result } = await prepareOrder(values);
    if ("errors" in result) return { ok: false, errors: result.errors };
    return { ok: true, id: await insertOrder(db, result.input) };
  } catch (e) {
    console.error("createOrder failed", e);
    return { ok: false, formError: "unknown" };
  }
}

export async function updateOrder(id: string, values: OrderFormValues): Promise<SaveResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };
  if (!isUuid(id)) return { ok: false, formError: "notFound" };
  try {
    const { db, result } = await prepareOrder(values);
    if ("errors" in result) return { ok: false, errors: result.errors };
    return (await writeOrder(db, id, result.input)) ? { ok: true, id } : { ok: false, formError: "notFound" };
  } catch (e) {
    console.error("updateOrder failed", e);
    return { ok: false, formError: "unknown" };
  }
}

export async function deleteOrder(id: string): Promise<DeleteResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };
  if (!isUuid(id)) return { ok: false, formError: "notFound" };
  try {
    return (await removeOrder(createDb(), id)) ? { ok: true } : { ok: false, formError: "notFound" };
  } catch (e) {
    console.error("deleteOrder failed", e);
    return { ok: false, formError: "unknown" };
  }
}

// ---- Expenses --------------------------------------------------------------

async function prepareExpense(values: ExpenseFormValues) {
  const db = createDb();
  const categoryId = /^\d+$/.test(values.categoryId.trim()) ? Number(values.categoryId) : NaN;
  const categoryExists = Number.isSafeInteger(categoryId) ? await financeOptionExists(db, "expense_category", categoryId) : false;
  return { db, result: validateExpense(values, { categoryExists }) };
}

export async function createExpense(values: ExpenseFormValues): Promise<SaveResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };
  try {
    const { db, result } = await prepareExpense(values);
    if ("errors" in result) return { ok: false, errors: result.errors };
    return { ok: true, id: String(await insertExpense(db, result.input)) };
  } catch (e) {
    console.error("createExpense failed", e);
    return { ok: false, formError: "unknown" };
  }
}

export async function updateExpense(id: number, values: ExpenseFormValues): Promise<SaveResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };
  if (!isRowId(id)) return { ok: false, formError: "notFound" };
  try {
    const { db, result } = await prepareExpense(values);
    if ("errors" in result) return { ok: false, errors: result.errors };
    return (await writeExpense(db, id, result.input)) ? { ok: true, id: String(id) } : { ok: false, formError: "notFound" };
  } catch (e) {
    console.error("updateExpense failed", e);
    return { ok: false, formError: "unknown" };
  }
}

export async function deleteExpense(id: number): Promise<DeleteResult> {
  if (!(await allowed())) return { ok: false, formError: "forbidden" };
  if (!isRowId(id)) return { ok: false, formError: "notFound" };
  try {
    return (await removeExpense(createDb(), id)) ? { ok: true } : { ok: false, formError: "notFound" };
  } catch (e) {
    console.error("deleteExpense failed", e);
    return { ok: false, formError: "unknown" };
  }
}

// ---- Pick-lists (sales channels, expense categories) ------------------------

const KINDS: readonly FinanceOptionKind[] = ["channel", "expense_category"];

function checkName(raw: unknown): { name: string } | Extract<OptionResult, { ok: false }> {
  const name = typeof raw === "string" ? raw.trim() : "";
  if (!name) return { ok: false, error: "required" };
  if (name.length > OPTION_NAME_MAX) return { ok: false, error: "tooLong", max: OPTION_NAME_MAX };
  return { name };
}

export async function addOption(kind: FinanceOptionKind, rawName: string): Promise<OptionResult> {
  if (!(await allowed())) return { ok: false, error: "forbidden" };
  if (!KINDS.includes(kind)) return { ok: false, error: "notFound" };
  const checked = checkName(rawName);
  if ("ok" in checked) return checked;
  try {
    return await createFinanceOption(createDb(), kind, checked.name).then((r) => (r.ok ? r : { ok: false, error: r.reason }));
  } catch (e) {
    console.error("addOption failed", e);
    return { ok: false, error: "unknown" };
  }
}

export async function renameOption(kind: FinanceOptionKind, id: number, rawName: string): Promise<OptionResult> {
  if (!(await allowed())) return { ok: false, error: "forbidden" };
  if (!KINDS.includes(kind) || !isRowId(id)) return { ok: false, error: "notFound" };
  const checked = checkName(rawName);
  if ("ok" in checked) return checked;
  try {
    return await renameFinanceOption(createDb(), kind, id, checked.name).then((r) => (r.ok ? r : { ok: false, error: r.reason }));
  } catch (e) {
    console.error("renameOption failed", e);
    return { ok: false, error: "unknown" };
  }
}

export async function removeOption(kind: FinanceOptionKind, id: number): Promise<OptionResult> {
  if (!(await allowed())) return { ok: false, error: "forbidden" };
  if (!KINDS.includes(kind) || !isRowId(id)) return { ok: false, error: "notFound" };
  try {
    return await deleteFinanceOption(createDb(), kind, id).then((r) => (r.ok ? r : { ok: false, error: r.reason }));
  } catch (e) {
    console.error("removeOption failed", e);
    return { ok: false, error: "unknown" };
  }
}
