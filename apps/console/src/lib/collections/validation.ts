import type { CollectionInput, CollectionTextInput } from "@maple-print-lab/db";
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, SLUG_MAX } from "@/lib/products/types";
import { PRODUCT_LOCALES, type CollectionFormValues, type FieldErrors, type ProductLocale } from "./types";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Pure and shared by design: slug uniqueness is checked by the server action, which has the database. */
export function validateCollection(values: CollectionFormValues): { input: CollectionInput } | { errors: FieldErrors } {
  const errors: FieldErrors = {};
  const text = (key: string, raw: string, max?: number): string => {
    const value = raw.trim();
    if (!value) errors[key] = { code: "required" };
    else if (max !== undefined && value.length > max) errors[key] = { code: "tooLong", max };
    return value;
  };

  const slug = text("slug", values.slug, SLUG_MAX);
  if (slug && !errors.slug && !SLUG_PATTERN.test(slug)) errors.slug = { code: "invalidSlug" };

  const sortOrder = values.sortOrder.trim() === "" ? NaN : Number(values.sortOrder);
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 1_000_000) {
    errors.sortOrder = { code: values.sortOrder.trim() === "" ? "required" : "invalidNumber" };
  }

  const translations = {} as Record<ProductLocale, CollectionTextInput>;
  // Content first, then SEO: errors are listed in tab order.
  for (const locale of PRODUCT_LOCALES) {
    const v = values.translations[locale];
    translations[locale] = {
      title: text(`${locale}.title`, v.title),
      intro: text(`${locale}.intro`, v.intro),
      seoTitle: "",
      seoDescription: "",
    };
  }
  for (const locale of PRODUCT_LOCALES) {
    const v = values.translations[locale];
    translations[locale].seoTitle = text(`${locale}.seoTitle`, v.seoTitle, SEO_TITLE_MAX);
    translations[locale].seoDescription = text(`${locale}.seoDescription`, v.seoDescription, SEO_DESCRIPTION_MAX);
  }

  if (Object.keys(errors).length) return { errors };
  return { input: { slug, published: values.published, sortOrder, translations } };
}
