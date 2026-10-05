/**
 * Language-independent facts about the studio.
 * Translatable copy lives in lib/dictionaries/*.
 * TODO: replace every value marked TODO before going live.
 */
export const siteConfig = {
  name: "Maple Print Lab",
  // Single source of truth for the canonical origin (metadataBase, canonical,
  // hreflang, og:url, sitemap, robots, JSON-LD). Set NEXT_PUBLIC_SITE_URL on
  // the host; the fallback is the production domain. No trailing slash.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://mapleprintlab.store").replace(/\/+$/, ""),
  // TODO: real inbox
  email: "hello@mapleprintlab.ca",
  // TODO: real account
  instagram: "https://instagram.com/maple_print_lab",
  instagramHandle: "@mapleprintlab",
  // Structured-data address (used by JsonLd)
  address: {
    locality: "Vancouver",
    region: "BC",
    country: "CA",
  },
} as const;

export type SiteConfig = typeof siteConfig;
