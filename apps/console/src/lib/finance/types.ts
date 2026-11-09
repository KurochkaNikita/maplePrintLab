/** Form values are strings; numbers are parsed in `validation.ts`. */
export type OrderItemValues = {
  /** Catalogue product id, or "" for a custom item. */
  productId: string;
  description: string;
  quantity: string;
  unitPrice: string;
  unitCost: string;
};

export type OrderFormValues = {
  /** YYYY-MM-DD */
  orderedOn: string;
  channelId: string;
  note: string;
  items: OrderItemValues[];
};

export type ExpenseFormValues = {
  /** YYYY-MM-DD */
  spentOn: string;
  categoryId: string;
  description: string;
  amount: string;
};

export type ErrorCode =
  | "required"
  | "tooLong"
  | "invalidNumber"
  | "invalidPrice"
  | "invalidDate"
  | "unknownChannel"
  | "unknownCategory"
  | "unknownProduct"
  | "itemsRequired";

export type FieldError = { code: ErrorCode; max?: number };

/** Keyed by field path: `orderedOn`, `channelId`, `items`, `items.<i>.description|quantity|unitPrice|unitCost|productId`. */
export type FieldErrors = Record<string, FieldError>;

export type FormErrorKind = "forbidden" | "notFound" | "unknown";

export type SaveResult =
  | { ok: true; id: string }
  | { ok: false; errors: FieldErrors }
  | { ok: false; formError: FormErrorKind };

export type DeleteResult = { ok: true } | { ok: false; formError: FormErrorKind };

/** Result of changing a pick-list entry. */
export type OptionResult = { ok: true } | { ok: false; error: "required" | "tooLong" | "taken" | "inUse" | "notFound" | "forbidden" | "unknown"; max?: number };

export const DESCRIPTION_MAX = 200;
export const NOTE_MAX = 1000;
export const OPTION_NAME_MAX = 60;

/** DOM id of the input behind a `FieldErrors` key. */
export function fieldId(prefix: string, key: string): string {
  return `${prefix}-${key.replace(/\./g, "-")}`;
}
