/** Origin of the console app (admin.mapleprintlab.store), no trailing slash. Locally: https://localhost:3001 */
export const consoleUrl = (process.env.NEXT_PUBLIC_CONSOLE_URL || "").replace(/\/+$/, "");

/** Endpoint of the order API in the console app. Without a console URL the order button stays a plain link to /contact/. */
export const orderApiUrl = consoleUrl ? `${consoleUrl}/api/order-request` : "";

/** Cloudflare Turnstile site key. Without it no widget is shown (the server then only accepts this in development). */
export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
