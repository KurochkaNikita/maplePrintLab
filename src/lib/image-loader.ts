/**
 * `next/image` loader for the static export (no server-side optimisation).
 * Product front photos have pre-generated variants (`<name>-front-480|800|1200.webp`,
 * see scripts/resize-images.mjs); everything else is served as-is.
 */
const FRONT = /-front\.webp$/;

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  if (!FRONT.test(src)) return src;
  const variant = width <= 480 ? 480 : width <= 800 ? 800 : 1200;
  return src.replace(FRONT, `-front-${variant}.webp`);
}
