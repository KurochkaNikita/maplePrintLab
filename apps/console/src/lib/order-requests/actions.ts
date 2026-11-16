"use server";

import { createDb, setOrderRequestStatus } from "@maple-print-lab/db";
import { requireAdmin } from "@/lib/auth/server";
import { isRequestStatus, isUuid } from "./params";

export type StatusResult = { ok: true } | { ok: false; formError: "forbidden" | "notFound" | "unknown" };

/** Sets the status of a request. Touches nothing else, so a status change never rewrites other fields. */
export async function changeRequestStatus(id: string, status: string): Promise<StatusResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, formError: "forbidden" };
  }
  if (!isUuid(id) || !isRequestStatus(status)) return { ok: false, formError: "notFound" };

  try {
    return (await setOrderRequestStatus(createDb(), id, status)) ? { ok: true } : { ok: false, formError: "notFound" };
  } catch (e) {
    console.error("changeRequestStatus failed", e);
    return { ok: false, formError: "unknown" };
  }
}
