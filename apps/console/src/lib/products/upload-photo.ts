/** Why the server turned a photo down; `failed` covers everything else (network, storage, unexpected). */
export type UploadPhotoFailure = "ratio" | "tooSmall" | "unreadable" | "tooLarge" | "failed";

export type UploadPhotoResult =
  | { ok: true; url: string; width: number; height: number }
  | { ok: false; reason: UploadPhotoFailure };

const KNOWN_FAILURES: readonly UploadPhotoFailure[] = ["ratio", "tooSmall", "unreadable", "tooLarge"];

/** Sends an already cropped 4:3 image to `/api/photos`, which resizes it and stores the versions. Never throws. */
export async function uploadPhoto(cropped: Blob): Promise<UploadPhotoResult> {
  try {
    const body = new FormData();
    body.append("file", cropped, "photo.jpg");
    const res = await fetch("/api/photos", { method: "POST", body });

    if (!res.ok) {
      const error = ((await res.json().catch(() => null)) as { error?: string } | null)?.error;
      const known = KNOWN_FAILURES.find((reason) => reason === error);
      return { ok: false, reason: known ?? "failed" };
    }

    const { url, width, height } = (await res.json()) as { url: string; width: number; height: number };
    return { ok: true, url, width, height };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
