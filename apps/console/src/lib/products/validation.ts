import type { PriceTier, ProductInput, ProductTextInput } from "@maple-print-lab/db";
import {
  PRODUCT_LOCALES,
  MAX_PHOTOS,
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  SLUG_MAX,
  type FieldErrors,
  type ProductFormValues,
  type ProductLocale,
} from "./types";

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";
const LEGACY_FILE_PATTERN = /^[\w.-]+\.(webp|jpe?g|png)$/i;

/** Only our own Blob store (or a bare file name from the site) may be stored: the URL ends up on public pages. */
export function isValidPhotoRef(ref: string): boolean {
  if (LEGACY_FILE_PATTERN.test(ref)) return true;
  try {
    const url = new URL(ref);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** What the server learned from the database before validating. */
export type ValidationContext = {
  categoryExists: boolean;
};

/** Accepts "1.5" and "1,5" (French decimal comma). */
function parseDecimal(raw: string, maxFractionDigits?: number): number | null {
  const s = raw.trim().replace(",", ".");
  const pattern = maxFractionDigits === undefined ? /^\d+(\.\d+)?$/ : new RegExp(`^\\d+(\\.\\d{1,${maxFractionDigits}})?$`);
  return pattern.test(s) ? Number(s) : null;
}

/**
 * Volume-price rows, or null when there are none (the single price applies). Blank rows are dropped;
 * rows must be in ascending order without overlaps, and only the last may be open-ended.
 */
function parseTiers(values: ProductFormValues, errors: FieldErrors): PriceTier[] | null {
  const tiers: PriceTier[] = [];
  let previousEnd = 0;
  values.priceTiers.forEach((row, i) => {
    const key = (field: string) => `priceTiers.${i}.${field}`;
    const from = row.from.trim();
    const to = row.to.trim();
    const amount = row.amount.trim();
    if (!from && !to && !amount) return;

    const fromN = from === "" ? NaN : Number(from);
    const toN = to === "" ? undefined : Number(to);
    if (!from) errors[key("from")] = { code: "required" };
    else if (!Number.isInteger(fromN) || fromN < 1 || fromN > 1_000_000) errors[key("from")] = { code: "invalidNumber" };
    else if (fromN <= previousEnd) errors[key("from")] = { code: "tierOrder" };
    if (toN !== undefined && (!Number.isInteger(toN) || toN < fromN || toN > 1_000_000)) {
      errors[key("to")] = { code: Number.isInteger(toN) && toN < fromN ? "tierOrder" : "invalidNumber" };
    }
    const price = amount ? parseDecimal(amount, 2) : null;
    if (!amount) errors[key("amount")] = { code: "required" };
    else if (price === null || price <= 0 || price >= 100_000_000) errors[key("amount")] = { code: "invalidPrice" };

    tiers.push({ from: fromN, ...(toN === undefined ? {} : { to: toN }), amount: price ?? 0 });
    previousEnd = toN ?? Infinity;
  });
  return tiers.length ? tiers : null;
}

/**
 * Pure and shared by design: slug uniqueness and collection existence are checked
 * by the server action, which has the database.
 */
export function validateProduct(
  values: ProductFormValues,
  ctx: ValidationContext,
): { input: ProductInput } | { errors: FieldErrors } {
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

  const categoryId = values.categoryId.trim();
  if (!categoryId) errors.categoryId = { code: "required" };
  else if (!ctx.categoryExists) errors.categoryId = { code: "unknownCategory" };

  const sortOrder = values.sortOrder.trim() === "" ? NaN : Number(values.sortOrder);
  if (!Number.isInteger(sortOrder) || sortOrder < 0 || sortOrder > 1_000_000) {
    errors.sortOrder = { code: values.sortOrder.trim() === "" ? "required" : "invalidNumber" };
  }

  // Content (before pricing and SEO: errors are listed in tab order)
  const translations = {} as Record<ProductLocale, ProductTextInput>;
  for (const locale of PRODUCT_LOCALES) {
    const v = values.translations[locale];
    const highlights = v.highlights.flatMap((h, i) => {
      const title = h.title.trim();
      const body = h.text.trim();
      if (!title && !body) return []; // blank rows are dropped
      if (!title) errors[`${locale}.highlights.${i}.title`] = { code: "required" };
      if (!body) errors[`${locale}.highlights.${i}.text`] = { code: "required" };
      return [{ title, text: body }];
    });
    translations[locale] = {
      title: text(`${locale}.title`, v.title),
      note: text(`${locale}.note`, v.note),
      material: "",
      description: text(`${locale}.description`, v.description),
      highlights,
      seoTitle: "",
      seoDescription: "",
    };
  }

  // Pricing and size
  let priceAmount: string | null = null;
  let priceTiers: PriceTier[] | null = null;
  if (values.priceMode === "tiers") {
    priceTiers = parseTiers(values, errors);
    if (!priceTiers) errors.priceTiers = { code: "tiersRequired" };
  } else {
    const raw = values.priceAmount.trim();
    if (!raw) errors.priceAmount = { code: "required" };
    else {
      const price = parseDecimal(raw, 2);
      if (price === null || price <= 0 || price >= 100_000_000) errors.priceAmount = { code: "invalidPrice" };
      else priceAmount = price.toFixed(2);
    }
  }

  const material = text("material", values.material);
  for (const locale of PRODUCT_LOCALES) translations[locale].material = material;

  const dimension = (unit: "cm" | "in"): [number, number, number] =>
    values.dimensions[unit].map((raw, i) => {
      const key = `dimensions.${unit}.${i}`;
      if (!raw.trim()) {
        errors[key] = { code: "required" };
        return 0;
      }
      const n = parseDecimal(raw);
      if (n === null || n <= 0 || n >= 100_000) {
        errors[key] = { code: "invalidNumber" };
        return 0;
      }
      return n;
    }) as [number, number, number];
  const cm = dimension("cm");
  const inches = dimension("in");

  // Photos: the first one is the main photo and is required
  if (!values.photos.length) errors.photos = { code: "photoRequired" };
  else if (values.photos.length > MAX_PHOTOS) errors.photos = { code: "invalidPhoto" };
  const images = values.photos.slice(0, MAX_PHOTOS).map((photo, i) => {
    const validSize = Number.isInteger(photo.width) && photo.width > 0 && Number.isInteger(photo.height) && photo.height > 0;
    if (!isValidPhotoRef(photo.url) || !validSize) errors[`photos.${i}.url`] = { code: "invalidPhoto" };
    const alts = {} as Record<ProductLocale, string>;
    for (const locale of PRODUCT_LOCALES) {
      alts[locale] = text(`photos.${i}.alts.${locale}`, photo.alts?.[locale] ?? "");
    }
    return { file: photo.url, width: photo.width, height: photo.height, alts };
  });

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
      categoryId,
      collectionIds: [...new Set(values.collectionIds)],
      published: values.published,
      noindex: values.noindex,
      isNew: values.isNew,
      sortOrder,
      priceAmount,
      priceTiers,
      // "From" only makes sense next to a price the admin typed in.
      priceFrom: values.priceMode === "tiers" ? false : values.priceFrom,
      dimensions: { cm, in: inches },
      images,
      translations,
    },
  };
}
