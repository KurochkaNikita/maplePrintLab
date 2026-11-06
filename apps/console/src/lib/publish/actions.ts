"use server";

import { requireAdmin } from "@/lib/auth/server";

export type PublishResult = { ok: true } | { ok: false; error: "forbidden" | "notConfigured" | "failed" };

/**
 * Starts a rebuild of the public site (a static export that reads the catalogue at build time) through the
 * Vercel Deploy Hook of the public project. The hook URL is a secret and only lives on the server.
 */
export async function publishSite(): Promise<PublishResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "forbidden" };
  }

  const hook = process.env.SITE_DEPLOY_HOOK_URL;
  if (!hook) return { ok: false, error: "notConfigured" };

  try {
    const response = await fetch(hook, { method: "POST", cache: "no-store" });
    if (!response.ok) {
      console.error("deploy hook answered", response.status);
      return { ok: false, error: "failed" };
    }
    return { ok: true };
  } catch (e) {
    console.error("deploy hook failed", e);
    return { ok: false, error: "failed" };
  }
}
