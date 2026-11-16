const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Checks a Cloudflare Turnstile token. Without `TURNSTILE_SECRET_KEY` it passes in development only,
 * so a missing secret in production blocks the form instead of silently disabling the check.
 */
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV !== "production") return true;
    console.error("order-request: TURNSTILE_SECRET_KEY is not set");
    return false;
  }
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const response = await fetch(VERIFY_URL, { method: "POST", body });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (e) {
    console.error("order-request: Turnstile verification failed", e);
    return false;
  }
}
