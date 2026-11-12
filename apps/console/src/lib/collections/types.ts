// Not "@maple-print-lab/db": this file is imported by client components, and the package root pulls in the DB driver.
import { PRODUCT_LOCALES, type ProductLocale } from "@maple-print-lab/db/src/locales";

export { PRODUCT_LOCALES, type ProductLocale };

/** Every input is a string. */
export type CollectionTextValues = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
};

export type CollectionFormValues = {
  slug: string;
  published: boolean;
  sortOrder: string;
  translations: Record<ProductLocale, CollectionTextValues>;
};

export type ErrorCode = "required" | "invalidSlug" | "slugTaken" | "tooLong" | "invalidNumber";

export type FieldError = { code: ErrorCode; max?: number };

/** Keyed by field path, in tab order: `slug`, `sortOrder`, `<locale>.title`, `<locale>.intro`, `<locale>.seoTitle`, … */
export type FieldErrors = Record<string, FieldError>;

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; errors: FieldErrors }
  | { ok: false; formError: "forbidden" | "notFound" | "unknown" };

export type DeleteResult = { ok: true } | { ok: false; formError: "forbidden" | "notFound" | "unknown" };

/** `products` is a read-only list, shown only when editing; no field belongs to it. */
export type TabId = "general" | "content" | "seo" | "products";
export const TAB_IDS: readonly TabId[] = ["general", "content", "seo", "products"];

/** Which tab holds the input behind a `FieldErrors` key. */
export function tabOfField(key: string): TabId {
  const [locale, field] = key.split(".");
  if (locale && (PRODUCT_LOCALES as readonly string[]).includes(locale)) {
    return field === "seoTitle" || field === "seoDescription" ? "seo" : "content";
  }
  return "general";
}

/** DOM id of the input behind a `FieldErrors` key. */
export function fieldId(key: string): string {
  return `colf-${key.replace(/\./g, "-")}`;
}

/** The language an error key belongs to, if any (`en.title` -> `en`). */
export function localeOfField(key: string): ProductLocale | null {
  const locale = key.split(".")[0];
  return (PRODUCT_LOCALES as readonly string[]).includes(locale) ? (locale as ProductLocale) : null;
}

/** Number of invalid fields per tab, for the badges on the tab buttons. */
export function countErrorsByTab(errors: FieldErrors): Record<TabId, number> {
  const counts: Record<TabId, number> = { general: 0, content: 0, seo: 0, products: 0 };
  for (const key of Object.keys(errors)) counts[tabOfField(key)] += 1;
  return counts;
}

/** The first invalid field as the user sees it (tab order). */
export function firstErrorKey(errors: FieldErrors): string | undefined {
  return Object.keys(errors).sort((a, b) => TAB_IDS.indexOf(tabOfField(a)) - TAB_IDS.indexOf(tabOfField(b)))[0];
}
