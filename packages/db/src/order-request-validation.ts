// No imports on purpose: the public site (client component) and the console both use these rules,
// and a client bundle must not pull in the database driver.

export const ORDER_REQUEST_LOCALES = ["en", "fr"] as const;
export type OrderRequestLocale = (typeof ORDER_REQUEST_LOCALES)[number];

export const ORDER_REQUEST_LIMITS = { name: 80, email: 254, message: 2000, items: 20, quantity: 10 } as const;

/** One line of a request as the browser sends it: only which product and how many. Title and price come from the catalogue. */
export type OrderRequestItemValue = { slug: string; quantity: number };

/** What the customer types, plus the products they are asking about. */
export type OrderRequestValues = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  items: OrderRequestItemValue[];
  locale: string;
};

export type OrderRequestInput = {
  firstName: string;
  lastName: string;
  email: string;
  message: string | null;
  /** Checked: slugs are unique, quantities are whole numbers from 1 to the limit. */
  items: OrderRequestItemValue[];
  locale: OrderRequestLocale;
};

/** Codes, not texts: the client translates them. */
export type OrderRequestErrorCode =
  | "required"
  | "tooLong"
  | "invalidEmail"
  | "invalidLocale"
  | "unknownProduct"
  | "noItems"
  | "tooManyItems"
  | "invalidQuantity"
  | "tooFast"
  | "captcha"
  | "rateLimited"
  | "badRequest"
  | "server";

/** Keyed by field (`firstName`, `email`, `items`, ...) or `form` for a problem with the whole submission. */
export type OrderRequestErrors = Partial<Record<keyof OrderRequestValues | "form", OrderRequestErrorCode>>;

/** Deliberately simple: one `@`, no spaces, a dot in the domain. The mail server has the final say. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
// Control characters have no place in a name or an address (and would allow header injection in the notification mail).
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

/** The same product twice becomes one line (quantities add up, capped). "invalid" when a line is not a usable slug and quantity. */
function mergeItems(items: OrderRequestItemValue[]): OrderRequestItemValue[] | "invalid" {
  const bySlug = new Map<string, number>();
  for (const item of items) {
    const slug = typeof item?.slug === "string" ? item.slug.trim() : "";
    if (!slug || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > ORDER_REQUEST_LIMITS.quantity) return "invalid";
    bySlug.set(slug, Math.min((bySlug.get(slug) ?? 0) + item.quantity, ORDER_REQUEST_LIMITS.quantity));
  }
  return [...bySlug].map(([slug, quantity]) => ({ slug, quantity }));
}

export function validateOrderRequest(values: OrderRequestValues): { input: OrderRequestInput } | { errors: OrderRequestErrors } {
  const errors: OrderRequestErrors = {};
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!firstName || CONTROL_CHARS.test(firstName)) errors.firstName = "required";
  else if (firstName.length > ORDER_REQUEST_LIMITS.name) errors.firstName = "tooLong";

  if (!lastName || CONTROL_CHARS.test(lastName)) errors.lastName = "required";
  else if (lastName.length > ORDER_REQUEST_LIMITS.name) errors.lastName = "tooLong";

  if (!email) errors.email = "required";
  else if (email.length > ORDER_REQUEST_LIMITS.email) errors.email = "tooLong";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "invalidEmail";

  if (message.length > ORDER_REQUEST_LIMITS.message) errors.message = "tooLong";

  const items = mergeItems(values.items);
  if (items === "invalid") errors.items = "invalidQuantity";
  else if (!items.length) errors.items = "noItems";
  else if (items.length > ORDER_REQUEST_LIMITS.items) errors.items = "tooManyItems";
  if (!(ORDER_REQUEST_LOCALES as readonly string[]).includes(values.locale)) errors.locale = "invalidLocale";

  if (Object.keys(errors).length) return { errors };
  return {
    input: {
      firstName,
      lastName,
      email,
      message: message || null,
      items: items as OrderRequestItemValue[],
      locale: values.locale as OrderRequestLocale,
    },
  };
}
