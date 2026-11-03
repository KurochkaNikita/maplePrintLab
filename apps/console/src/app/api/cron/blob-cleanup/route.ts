import { timingSafeEqual } from "node:crypto";
import { createDb } from "@maple-print-lab/db";
import { cleanUpOrphanPhotos } from "@/lib/products/photo-cleanup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Constant-time check of `Authorization: Bearer <CRON_SECRET>`, which Vercel Cron sends. */
function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const wanted = Buffer.from(`Bearer ${secret}`);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

/**
 * Daily job (see vercel.json) that removes uploaded product photos no product uses. Not covered by the
 * proxy matcher and not an admin session, so it checks CRON_SECRET itself. `?dryRun=1` only reports.
 */
export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 });

  try {
    const dryRun = new URL(request.url).searchParams.get("dryRun") === "1";
    return Response.json(await cleanUpOrphanPhotos(createDb(), { dryRun }));
  } catch (e) {
    console.error("blob cleanup failed", e);
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
