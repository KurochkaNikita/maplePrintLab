import "server-only";
import sharp, { type Metadata } from "sharp";
import { PHOTO_ASPECT, PHOTO_MAX_WIDTH, PHOTO_MIN_WIDTH, PHOTO_VARIANT_WIDTHS } from "./photos";

export type PhotoVersion = { suffix: string; width: number; height: number; data: Buffer };

export class PhotoRejected extends Error {
  constructor(readonly reason: "unreadable" | "ratio" | "tooSmall") {
    super(reason);
  }
}

/**
 * Turns an already cropped 4:3 image into WebP versions: the largest (up to 1600×1200, never upscaled)
 * with suffix "" and the 1200×900, 800×600 and 480×360 ones.
 */
export async function processPhoto(input: Buffer): Promise<PhotoVersion[]> {
  let meta: Metadata;
  try {
    meta = await sharp(input).metadata();
  } catch {
    throw new PhotoRejected("unreadable");
  }
  // EXIF orientations 5-8 swap the stored width and height.
  const swapped = (meta.orientation ?? 1) >= 5;
  const width = (swapped ? meta.height : meta.width) ?? 0;
  const height = (swapped ? meta.width : meta.height) ?? 0;
  if (!width || !height) throw new PhotoRejected("unreadable");
  if (Math.abs(width / height - PHOTO_ASPECT) > 0.02) throw new PhotoRejected("ratio");
  if (width < PHOTO_MIN_WIDTH) throw new PhotoRejected("tooSmall");

  const top = Math.min(width, PHOTO_MAX_WIDTH);
  const targets = [{ suffix: "", width: top }, ...PHOTO_VARIANT_WIDTHS.map((w) => ({ suffix: `-${w}`, width: w }))];

  return Promise.all(
    targets.map(async ({ suffix, width: w }) => {
      const h = Math.round((w * 3) / 4);
      // The aspect was checked above, so `cover` only trims rounding differences.
      const data = await sharp(input).rotate().resize(w, h, { fit: "cover" }).webp({ quality: 82 }).toBuffer();
      return { suffix, width: w, height: h, data };
    }),
  );
}
