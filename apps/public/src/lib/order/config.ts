/** Endpoint of the order API in the console app. Without it the order button stays a plain link to /contact/. */
export const orderApiUrl = process.env.NEXT_PUBLIC_ORDER_API_URL || "";

/** Cloudflare Turnstile site key. Without it no widget is shown (the server then only accepts this in development). */
export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
