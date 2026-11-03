/**
 * `next/image` loader for the static export (no server-side optimisation).
 * Photos uploaded from the console live in Vercel Blob as `…/photo.webp` next to `photo-480|800|1200.webp`;
 * the requested width is mapped to the closest of those. Anything else is served as-is.
 */
const BLOB_PHOTO = /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\/.+\/photo\.webp$/;

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  if (!BLOB_PHOTO.test(src)) return src;
  const variant = width <= 480 ? 480 : width <= 800 ? 800 : 1200;
  return src.replace(/\.webp$/, `-${variant}.webp`);
}
