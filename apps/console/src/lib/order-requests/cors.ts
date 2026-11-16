/**
 * Origins allowed to call the public order endpoint: the public site (`NEXT_PUBLIC_SITE_URL`) plus the optional
 * extra origins in `PUBLIC_SITE_ORIGIN`, comma-separated (local dev, Vercel previews).
 */
export function allowedOrigins(
  site = process.env.NEXT_PUBLIC_SITE_URL,
  extra = process.env.PUBLIC_SITE_ORIGIN,
): string[] {
  const origins = [site ?? "", ...(extra ?? "").split(",")]
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  return [...new Set(origins)];
}

/** The request's own origin when it is on the list, otherwise null. Never a wildcard. */
export function matchOrigin(origin: string | null, allowed = allowedOrigins()): string | null {
  return origin && allowed.includes(origin) ? origin : null;
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = { Vary: "Origin" };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return headers;
}
