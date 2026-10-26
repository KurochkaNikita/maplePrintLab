/**
 * Origin of the public site (same value as the public project), no trailing slash.
 * No fallback, so the domain is not hard-coded a second time: without it, photos imported from the site have no preview.
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
