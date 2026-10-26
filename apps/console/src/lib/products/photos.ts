/** Product photos are 4:3. The cropped upload is at most 1600×1200; the server derives smaller versions. */
export const PHOTO_ASPECT = 4 / 3;
export const PHOTO_MAX_WIDTH = 1600;
/** Below this the largest version (1200×900) would be an upscale. */
export const PHOTO_MIN_WIDTH = 1200;
export const PHOTO_MIN_HEIGHT = (PHOTO_MIN_WIDTH * 3) / 4;
/** Widths of the smaller versions: 1200×900, 800×600, 480×360. */
export const PHOTO_VARIANT_WIDTHS = [1200, 800, 480] as const;
/** Largest request the host accepts is ~4.5 MB; a cropped 1600×1200 JPEG is far below this. */
export const MAX_CROPPED_BYTES = 4 * 1024 * 1024;

const BLOB_PHOTO = /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\/.+\.webp$/;

/**
 * Photos are stored as `<id>.webp` (the largest) next to `<id>-1200.webp`, `<id>-800.webp` and `<id>-480.webp`.
 * Anything else (a bare file name imported from the site) has no known versions and is returned unchanged.
 */
export function photoVariantUrl(url: string, width: (typeof PHOTO_VARIANT_WIDTHS)[number]): string {
  return BLOB_PHOTO.test(url) ? url.replace(/\.webp$/, `-${width}.webp`) : url;
}
