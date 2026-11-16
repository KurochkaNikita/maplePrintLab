import { createHash } from "node:crypto";

/** Address of the visitor as the host reports it (Vercel sets `x-forwarded-for`). */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || "unknown";
}

/** sha256(ip + salt): enough to rate-limit, and the address itself is never stored. */
export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(ip + salt).digest("hex");
}
