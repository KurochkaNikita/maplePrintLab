// Not "@maple-print-lab/db": this file is imported by client components, and the package root pulls in the DB driver.
import { PRODUCT_LOCALES, productPath, type ProductLocale } from "@maple-print-lab/db/src/locales";

export { PRODUCT_LOCALES, productPath, type ProductLocale };

/** Shown in the form next to each language's fields, each in its own language. */
export const PRODUCT_LOCALE_LABELS: Record<ProductLocale, string> = {
  en: "English (EN)",
  fr: "Français (FR)",
};

/** Site rule: <title> ≤ 60 characters including the template suffix " — Maple Print Lab" (18). */
export const SEO_TITLE_SUFFIX = " — Maple Print Lab";
export const SEO_TITLE_MAX = 60 - SEO_TITLE_SUFFIX.length;
export const SEO_DESCRIPTION_MAX = 155;
export const SLUG_MAX = 80;

/** One required main photo plus up to three optional ones. */
export const MAX_PHOTOS = 4;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** `url` is a Blob URL, or a bare file name for photos imported from the site (see `ProductImageInput`). */
export type PhotoValues = {
  url: string;
  width: number;
  height: number;
  alts: Record<ProductLocale, string>;
};

/** Every input is a string; numbers are parsed on the server. */
export type HighlightValues = { title: string; text: string };

export type ProductTextValues = {
  title: string;
  note: string;
  description: string;
  highlights: HighlightValues[];
  seoTitle: string;
  seoDescription: string;
};

export type ProductFormValues = {
  slug: string;
  categoryId: string;
  collectionIds: string[];
  published: boolean;
  noindex: boolean;
  isNew: boolean;
  sortOrder: string;
  priceAmount: string;
  priceFrom: boolean;
  /** One value for every language (stored on each translation row). */
  material: string;
  /** Main photo first. */
  photos: PhotoValues[];
  /** Width × height × depth. */
  dimensions: { cm: [string, string, string]; in: [string, string, string] };
  translations: Record<ProductLocale, ProductTextValues>;
};

export type ErrorCode =
  | "required"
  | "invalidSlug"
  | "slugTaken"
  | "tooLong"
  | "invalidNumber"
  | "invalidPrice"
  | "photoRequired"
  | "invalidPhoto"
  | "unknownCategory"
  | "unknownCollection";

export type FieldError = { code: ErrorCode; max?: number };

/**
 * Keyed by field path, in tab order: `slug`, `categoryId`, `collectionIds`, `sortOrder`,
 * `<locale>.title`, `<locale>.highlights.<i>.text`, `priceAmount`, `dimensions.cm.<i>`, `photos`,
 * `photos.<i>.alts.<locale>`,
 * `<locale>.seoTitle`, …
 */
export type FieldErrors = Record<string, FieldError>;

export type ActionResult =
  | { ok: true; id: number }
  | { ok: false; errors: FieldErrors }
  | { ok: false; formError: "forbidden" | "notFound" | "unknown" };

export type TabId = "general" | "content" | "pricing" | "images" | "seo";
export const TAB_IDS: readonly TabId[] = ["general", "content", "pricing", "images", "seo"];

/** Which tab holds the input behind a `FieldErrors` key. */
export function tabOfField(key: string): TabId {
  if (key === "photos" || key.startsWith("photos.")) return "images";
  if (key.startsWith("dimensions.") || key === "priceAmount" || key === "material") return "pricing";
  const [locale, field] = key.split(".");
  if (locale && (PRODUCT_LOCALES as readonly string[]).includes(locale)) {
    return field === "seoTitle" || field === "seoDescription" ? "seo" : "content";
  }
  return "general";
}

/** DOM id of the input behind a `FieldErrors` key. */
export function fieldId(key: string): string {
  return `pf-${key.replace(/\./g, "-")}`;
}

/** The language an error key belongs to, if any (`en.title` -> `en`). */
export function localeOfField(key: string): ProductLocale | null {
  const locale = key.split(".")[0];
  return (PRODUCT_LOCALES as readonly string[]).includes(locale) ? (locale as ProductLocale) : null;
}
