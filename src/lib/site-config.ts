/**
 * Language-independent facts about the studio.
 * Translatable copy lives in lib/dictionaries/*.
 * TODO: replace every value marked TODO before going live.
 */
export const siteConfig = {
  name: "Maple Print Lab",
  // TODO: register the domain and update (https, no trailing slash)
  url: "https://mapleprintlab.ca",
  // TODO: real inbox
  email: "hello@mapleprintlab.ca",
  // TODO: real account
  instagram: "https://instagram.com/mapleprintlab",
  instagramHandle: "@mapleprintlab",
  // Structured-data address (used by JsonLd)
  address: {
    locality: "Vancouver",
    region: "BC",
    country: "CA",
  },
} as const;

export type SiteConfig = typeof siteConfig;
