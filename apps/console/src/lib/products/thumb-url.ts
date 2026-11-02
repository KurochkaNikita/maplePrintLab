import { photoVariantUrl } from "./photos";

/**
 * URL of the 480 px thumbnail for a product's main photo, or null when there is none to show.
 * Uploaded photos live in Blob; photos imported from the site are bare file names under the site's
 * `/product/<slug>/` and need its origin (the storefront ships `<name>-front-480.webp` next to `<name>-front.webp`).
 */
export function productThumbUrl(slug: string, file: string | null, siteUrl?: string): string | null {
  if (!file) return null;
  if (/^https?:\/\//.test(file)) return photoVariantUrl(file, 480);
  if (!siteUrl) return null;
  return `${siteUrl}/product/${slug}/${file.replace(/-front\.webp$/, "-front-480.webp")}`;
}
