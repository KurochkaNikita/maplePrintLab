// Generates responsive WebP variants for product photos.
// For every public/product/<slug>/<name>-front.webp (the master) it writes
// <name>-front-480.webp, -800.webp and -1200.webp next to it (4:3, quality 78).
// Run: node scripts/resize-images.mjs   (uses sharp, installed with Next.js)
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = "public/product";
const WIDTHS = [480, 800, 1200];
const QUALITY = 78;

for (const slug of await readdir(ROOT)) {
  const dir = path.join(ROOT, slug);
  if (!(await stat(dir)).isDirectory()) continue;
  for (const file of await readdir(dir)) {
    if (!file.endsWith("-front.webp")) continue;
    const base = file.replace(/\.webp$/, "");
    for (const width of WIDTHS) {
      const out = path.join(dir, `${base}-${width}.webp`);
      const info = await sharp(path.join(dir, file))
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(out);
      console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
    }
  }
}
