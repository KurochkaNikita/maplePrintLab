import type { CategoryInput, CategoryTextInput } from "@maple-print-lab/db";
import { isValidPhotoRef } from "@/lib/products/validation";
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, SLUG_MAX } from "@/lib/products/types";
import {
  HIGHLIGHT_MAX,
  PRODUCT_LOCALES,
  type CategoryFormValues,
  type FieldErrors,
  type ProductLocale,
} from "./types";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Pure and shared by design: slug uniqueness is checked by the server action, which has the database.
 * Blank section and FAQ rows are dropped; a half-filled row is an error.
 */
export function validateCategory(values: CategoryFormValues): { input: CategoryInput } | { errors: FieldErrors } {
  const errors: FieldErrors = {};
  const text = (key: string, raw: string, max?: number): string => {
    const value = raw.trim();
    if (!value) errors[key] = { code: "required" };
    else if (max !== undefined && value.length > max) errors[key] = { code: "tooLong", max };
    return value;
  };

  // General
  const slug = text("slug", values.slug, SLUG_MAX);
  if (slug && !errors.slug && !SLUG_PATTERN.test(slug)) errors.slug = { code: "invalidSlug" };

  const sortOrder = values.sortOrder.trim() === "" ? NaN : Number(values.sortOrder);
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 1_000_000) {
    errors.sortOrder = { code: values.sortOrder.trim() === "" ? "required" : "invalidNumber" };
  }

  // Cover (optional)
  let cover: CategoryInput["cover"] = null;
  if (values.cover) {
    const { url, width, height } = values.cover;
    const validSize = Number.isInteger(width) && width > 0 && Number.isInteger(height) && height > 0;
    if (!isValidPhotoRef(url) || !validSize) errors["cover.url"] = { code: "invalidPhoto" };
    const alts = {} as Record<ProductLocale, string>;
    for (const locale of PRODUCT_LOCALES) alts[locale] = text(`cover.alts.${locale}`, values.cover.alts?.[locale] ?? "");
    cover = { file: url, width, height, alts };
  }

  // Content (before SEO: errors are listed in tab order)
  const translations = {} as Record<ProductLocale, CategoryTextInput>;
  for (const locale of PRODUCT_LOCALES) {
    const v = values.translations[locale];
    const key = (field: string) => `${locale}.${field}`;

    const title = text(key("title"), v.title);
    const intro = text(key("intro"), v.intro);
    const highlight = v.highlight.trim();
    if (highlight.length > HIGHLIGHT_MAX) errors[key("highlight")] = { code: "tooLong", max: HIGHLIGHT_MAX };

    const sections = v.sections.flatMap((s, i) => {
      const heading = s.heading.trim();
      const paragraphs = s.paragraphs
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      if (!heading && !paragraphs.length) return [];
      if (!heading) errors[key(`sections.${i}.heading`)] = { code: "required" };
      if (!paragraphs.length) errors[key(`sections.${i}.paragraphs`)] = { code: "required" };
      return [{ heading, paragraphs }];
    });
    const faq = v.faq.flatMap((f, i) => {
      const q = f.q.trim();
      const a = f.a.trim();
      if (!q && !a) return [];
      if (!q) errors[key(`faq.${i}.q`)] = { code: "required" };
      if (!a) errors[key(`faq.${i}.a`)] = { code: "required" };
      return [{ q, a }];
    });

    translations[locale] = {
      title,
      intro,
      highlight: highlight || null,
      seoTitle: "",
      seoDescription: "",
      seoBlock: sections.length || faq.length ? { sections, faq } : null,
    };
  }

  // SEO
  for (const locale of PRODUCT_LOCALES) {
    const v = values.translations[locale];
    translations[locale].seoTitle = text(`${locale}.seoTitle`, v.seoTitle, SEO_TITLE_MAX);
    translations[locale].seoDescription = text(`${locale}.seoDescription`, v.seoDescription, SEO_DESCRIPTION_MAX);
  }

  if (Object.keys(errors).length) return { errors };

  return {
    input: {
      slug,
      published: values.published,
      sortOrder,
      cover,
      translations,
    },
  };
}
