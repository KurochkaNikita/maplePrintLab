import { MAX_PHOTOS } from "../listing";
import { findPhotoInput } from "./fields";

/** Download, convert to JPEG (our photos are .webp; Facebook may reject it) and return as a File. */
async function toJpegFile(url: string, index: number): Promise<File> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`photo ${index + 1}: HTTP ${res.status}`);
  const bitmap = await createImageBitmap(await res.blob());
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  if (!blob) throw new Error(`photo ${index + 1}: could not convert`);
  return new File([blob], `photo-${index + 1}.jpg`, { type: "image/jpeg" });
}

/** Puts up to 10 photos (main first) into the form's file input. Returns how many were attached. */
export async function attachPhotos(urls: string[]): Promise<number> {
  const input = findPhotoInput();
  if (!input) throw new Error("photo input not found");

  const files: File[] = [];
  for (const [i, url] of urls.slice(0, MAX_PHOTOS).entries()) {
    try {
      files.push(await toJpegFile(url, i));
    } catch {
      // Skip a photo that failed; the rest still go in. The main photo failing is reported by the count.
    }
  }
  if (files.length === 0) throw new Error("no photo could be loaded");

  const transfer = new DataTransfer();
  files.forEach((f) => transfer.items.add(f));
  input.files = transfer.files;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  return files.length;
}
