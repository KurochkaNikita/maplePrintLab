/** A rectangle in the source image's own pixels. */
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("unreadable image"));
    img.src = src;
  });
}

/**
 * Cuts `area` out of the image at `src` and scales it down to at most `maxWidth` (never up), keeping `aspect`.
 * JPEG: every browser can encode it; the server turns it into WebP.
 */
export async function cropToJpeg(src: string, area: CropArea, aspect: number, maxWidth: number): Promise<Blob> {
  const img = await loadImage(src);
  const width = Math.min(Math.round(area.width), maxWidth);
  const height = Math.round(width / aspect);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  if (!blob) throw new Error("encode failed");
  return blob;
}
