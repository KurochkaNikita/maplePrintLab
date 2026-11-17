import type { MarketplaceListing } from "@maple-print-lab/extension/src/listing";
import type { ProductRecord } from "@maple-print-lab/db";
import { photoVariantUrl } from "@/lib/products/photos";
import { MARKETPLACE_DEFAULTS } from "./defaults";

export const MAX_TITLE_LENGTH = 100;
export const MAX_PHOTOS = 10;

const fmtNumber = (n: number): string => String(Number(n.toFixed(1)));
const fmtSize = (v: readonly number[]): string => v.map(fmtNumber).join(" × ");

/** "25 × 25 × 1.5 cm (10 × 10 × 0.6 in)", or null when the product has no dimensions. */
export function formatSize(dimensions: ProductRecord["dimensions"]): string | null {
  if (!dimensions.cm.some((n) => n > 0)) return null;
  return `${fmtSize(dimensions.cm)} cm (${fmtSize(dimensions.in)} in)`;
}

/** Whole CAD dollars: the single price, or the first tier; null when there is none. */
export function listingPrice(product: Pick<ProductRecord, "priceAmount" | "priceTiers">): number | null {
  const raw = product.priceTiers?.[0]?.amount ?? (product.priceAmount === null ? null : Number(product.priceAmount));
  return raw !== null && Number.isFinite(raw) && raw > 0 ? Math.round(raw) : null;
}

/** Absolute photo URLs, main first: the 1200 px version of Blob photos, the site copy for imported ones. */
export function listingPhotoUrls(product: Pick<ProductRecord, "slug" | "images">, siteUrl: string): string[] {
  return product.images
    .map((img) =>
      /^https:\/\//.test(img.file) ? photoVariantUrl(img.file, 1200) : `${siteUrl}/product/${product.slug}/${img.file}`,
    )
    .slice(0, MAX_PHOTOS);
}

const truncate = (s: string, max: number): string => (s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`);

/**
 * Builds the Marketplace listing for a product. Pure: no network, no globals except the defaults.
 * Returns null when the product cannot be listed (no English title, price or photo).
 */
export function buildListing(product: ProductRecord, siteUrl: string): MarketplaceListing | null {
  const en = product.translations.en;
  const price = listingPrice(product);
  const photoUrls = listingPhotoUrls(product, siteUrl);
  if (!en?.title.trim() || price === null || photoUrls.length === 0) return null;

  const { location, leadTimeDays, category } = MARKETPLACE_DEFAULTS;
  const size = formatSize(product.dimensions);
  const description = [
    en.description.trim(),
    [
      size && `Size: ${size}`,
      en.material.trim() && `Material: ${en.material.trim()}`,
      `3D-printed to order${location ? ` in ${location}` : ""}. Ready in ${leadTimeDays} days.`,
    ]
      .filter(Boolean)
      .join("\n"),
    `More photos and details: ${siteUrl}/en/product/${product.slug}/`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    version: 1,
    productId: product.id,
    title: truncate(en.title.trim(), MAX_TITLE_LENGTH),
    price,
    description,
    condition: "new",
    category,
    ...(location ? { location } : {}),
    photoUrls,
  };
}
