import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth/server";
import { processPhoto, PhotoRejected } from "@/lib/products/photo-process";
import { MAX_CROPPED_BYTES } from "@/lib/products/photos";

export const runtime = "nodejs";

const fail = (error: string, status: number) => Response.json({ error }, { status });

/**
 * Receives a photo the browser already cropped to 4:3, stores the resized WebP versions in Vercel Blob
 * and returns the URL of the largest one. Needs BLOB_READ_WRITE_TOKEN. Not covered by the proxy
 * matcher, so it checks access itself.
 */
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return fail("unauthorized", 401);
  }

  const file = (await request.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return fail("invalid", 400);
  if (file.size > MAX_CROPPED_BYTES) return fail("tooLarge", 413);

  try {
    const versions = await processPhoto(Buffer.from(await file.arrayBuffer()));
    // One folder per upload, fixed names inside it: the versions are found by suffix, not by a stored list.
    const id = crypto.randomUUID();
    const stored = await Promise.all(
      versions.map((v) =>
        put(`products/${id}/photo${v.suffix}.webp`, v.data, {
          access: "public",
          contentType: "image/webp",
          addRandomSuffix: false,
        }),
      ),
    );
    // versions[0] is the largest one, stored as `photo.webp`.
    const main = versions[0];
    const blob = stored[0];
    return Response.json({ url: blob.url, width: main.width, height: main.height });
  } catch (e) {
    if (e instanceof PhotoRejected) return fail(e.reason, 422);
    console.error("photo upload failed", e);
    return fail("failed", 500);
  }
}
