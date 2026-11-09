import type { ExpenseInput, OrderInput, OrderItemInput } from "@maple-print-lab/db";
import { isValidDate, parseMoney } from "./money";
import {
  DESCRIPTION_MAX,
  NOTE_MAX,
  type ExpenseFormValues,
  type FieldErrors,
  type OrderFormValues,
} from "./types";

/** What the caller knows about the database: the server asks it, the browser answers from the lists it was given. */
export type OrderContext = {
  channelExists: boolean;
  productExists: (id: number) => boolean;
};

export type ExpenseContext = { categoryExists: boolean };

function collector() {
  const errors: FieldErrors = {};
  const text = (key: string, raw: string, max?: number): string => {
    const value = raw.trim();
    if (!value) errors[key] = { code: "required" };
    else if (max !== undefined && value.length > max) errors[key] = { code: "tooLong", max };
    return value;
  };
  const id = (key: string, raw: string, exists: boolean, unknown: "unknownChannel" | "unknownCategory"): number => {
    const value = raw.trim();
    const n = /^\d+$/.test(value) ? Number(value) : NaN;
    if (!value) errors[key] = { code: "required" };
    else if (!Number.isSafeInteger(n) || !exists) errors[key] = { code: unknown };
    return n;
  };
  const date = (key: string, raw: string): string => {
    const value = raw.trim();
    if (!isValidDate(value)) errors[key] = { code: "invalidDate" };
    return value;
  };
  return { errors, text, id, date };
}

/** Pure and shared: the server action runs it again with answers from the database. */
export function validateOrder(
  values: OrderFormValues,
  ctx: OrderContext,
): { input: OrderInput } | { errors: FieldErrors } {
  const { errors, text, id, date } = collector();

  const orderedOn = date("orderedOn", values.orderedOn);
  const channelId = id("channelId", values.channelId, ctx.channelExists, "unknownChannel");
  const note = values.note.trim();
  if (note.length > NOTE_MAX) errors.note = { code: "tooLong", max: NOTE_MAX };

  if (!values.items.length) errors.items = { code: "itemsRequired" };
  const items = values.items.map((item, i): OrderItemInput => {
    const key = (field: string) => `items.${i}.${field}`;

    let productId: number | null = null;
    if (item.productId.trim()) {
      const n = /^\d+$/.test(item.productId.trim()) ? Number(item.productId) : NaN;
      if (!Number.isSafeInteger(n) || !ctx.productExists(n)) errors[key("productId")] = { code: "unknownProduct" };
      else productId = n;
    }

    const description = text(key("description"), item.description, DESCRIPTION_MAX);

    const quantity = item.quantity.trim() === "" ? NaN : Number(item.quantity);
    if (item.quantity.trim() === "") errors[key("quantity")] = { code: "required" };
    else if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100_000) errors[key("quantity")] = { code: "invalidNumber" };

    const price = item.unitPrice.trim() === "" ? null : parseMoney(item.unitPrice);
    if (item.unitPrice.trim() === "") errors[key("unitPrice")] = { code: "required" };
    else if (price === null) errors[key("unitPrice")] = { code: "invalidPrice" };

    // Cost is required (0 is allowed): a blank cost must not silently count as pure profit.
    const cost = item.unitCost.trim() === "" ? null : parseMoney(item.unitCost);
    if (item.unitCost.trim() === "") errors[key("unitCost")] = { code: "required" };
    else if (cost === null) errors[key("unitCost")] = { code: "invalidPrice" };

    return { productId, description, quantity, unitPrice: (price ?? 0).toFixed(2), unitCost: (cost ?? 0).toFixed(2) };
  });

  if (Object.keys(errors).length) return { errors };
  return { input: { orderedOn, channelId, note, items } };
}

export function validateExpense(
  values: ExpenseFormValues,
  ctx: ExpenseContext,
): { input: ExpenseInput } | { errors: FieldErrors } {
  const { errors, text, id, date } = collector();

  const spentOn = date("spentOn", values.spentOn);
  const categoryId = id("categoryId", values.categoryId, ctx.categoryExists, "unknownCategory");
  const description = text("description", values.description, DESCRIPTION_MAX);

  let amount = "";
  if (!values.amount.trim()) errors.amount = { code: "required" };
  else {
    const n = parseMoney(values.amount);
    if (n === null || n <= 0) errors.amount = { code: "invalidPrice" };
    else amount = n.toFixed(2);
  }

  if (Object.keys(errors).length) return { errors };
  return { input: { spentOn, categoryId, description, amount } };
}
