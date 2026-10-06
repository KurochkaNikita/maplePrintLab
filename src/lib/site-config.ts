/**
 * Language-independent facts about the studio.
 * Translatable copy lives in lib/dictionaries/*.
 */
export const siteConfig = {
  name: "Maple Print Lab",
  // Single source of truth for the canonical origin (metadataBase, canonical,
  // hreflang, og:url, sitemap, robots, JSON-LD). Set NEXT_PUBLIC_SITE_URL on
  // the host; the fallback is the production domain. No trailing slash.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://mapleprintlab.store").replace(/\/+$/, ""),
  // Fallback og:image / twitter:image / JSON-LD image for pages without their own photo.
  defaultOgImage: "/product/cool-cat-glasses/cool-cat-glasses-front.webp",
  email: "hello@mapleprintlab.store",
  instagram: "https://instagram.com/maple_print_lab",
  instagramHandle: "@maple_print_lab",
  // Structured-data address (used by JsonLd)
  address: {
    locality: "Coquitlam",
    region: "BC",
    country: "CA",
  },
} as const;

export type SiteConfig = typeof siteConfig;
