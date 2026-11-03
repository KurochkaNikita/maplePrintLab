import "server-only";
import { del, list, type ListBlobResultBlob } from "@vercel/blob";
import { listUploadedCoverRefs, listUploadedPhotoRefs, type Db } from "@maple-print-lab/db";

/** Photos are uploaded before the form is saved, so a young folder may still be on its way into a product. */
export const ORPHAN_MIN_AGE_MS = 24 * 60 * 60 * 1000;

/** Where `/api/photos` stores an upload: `products/<uuid>/photo[-<width>].webp`. */
const PHOTO_PREFIX = "products/";
const FOLDER = /^(products\/[^/]+)\//;

const folderOf = (pathname: string) => FOLDER.exec(pathname)?.[1] ?? null;

export type PhotoCleanupResult = { folders: number; orphans: number; deleted: number; dryRun: boolean };

/**
 * Deletes uploaded photo folders that no product or category cover references and that are older than `ORPHAN_MIN_AGE_MS`
 * (abandoned forms, replaced or removed photos). A folder is removed whole, with all its sizes.
 * With `dryRun` nothing is deleted.
 */
export async function cleanUpOrphanPhotos(
  db: Db,
  { dryRun = false, now = Date.now() }: { dryRun?: boolean; now?: number } = {},
): Promise<PhotoCleanupResult> {
  // Read the references first: a product saved while we list is then still seen as referenced
  // or is too young to be touched.
  const referenced = new Set(
    [
      ...(await listUploadedPhotoRefs(db)),
      ...(await listUploadedCoverRefs(db))
    ].flatMap((ref) => {
      try {
        const folder = folderOf(decodeURIComponent(new URL(ref).pathname.slice(1)));
        return folder ? [folder] : [];
      } catch {
        return [];
      }
    }),
  );

  const folders = new Map<string, ListBlobResultBlob[]>();
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PHOTO_PREFIX, cursor });
    for (const blob of page.blobs) {
      const folder = folderOf(blob.pathname);
      if (folder) folders.set(folder, [...(folders.get(folder) ?? []), blob]);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const orphans = [...folders].filter(
    ([folder, blobs]) => !referenced.has(folder) && blobs.every((b) => now - b.uploadedAt.getTime() >= ORPHAN_MIN_AGE_MS),
  );
  const urls = orphans.flatMap(([, blobs]) => blobs.map((b) => b.url));
  if (!dryRun && urls.length) await del(urls);

  return { folders: folders.size, orphans: orphans.length, deleted: dryRun ? 0 : urls.length, dryRun };
}
