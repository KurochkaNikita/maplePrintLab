/**
 * The contract between the admin console and the extension. The console imports this type,
 * so a change here shows up in both packages at typecheck time.
 */
export const LISTING_VERSION = 1;
export const STORAGE_KEY = "listing";
export const MAX_PHOTOS = 10;
export const MAX_TITLE_LENGTH = 100;

export type MarketplaceListing = {
  version: 1;
  productId: number;
  /** At most 100 characters. */
  title: string;
  /** Whole CAD dollars; for volume pricing, the price of the first tier. */
  price: number;
  /** Ready text from the description template. */
  description: string;
  condition: "new";
  /** Category path, for example "Home & Garden > Home Decor". */
  category: string;
  /** Default city. */
  location?: string;
  /** Absolute https URLs, at most 10, main photo first. */
  photoUrls: string[];
};

/** Messages the console sends with `chrome.runtime.sendMessage(EXTENSION_ID, …)`. */
export type ExtensionRequest = { type: "ping" } | { type: "listing"; listing: unknown };

export type ExtensionResponse =
  | { ok: true; version: number }
  | { ok: false; error: "unsupported-version" | "invalid-listing" | "unknown-message" };

/** True only for a listing this build knows how to fill; anything else must not touch the form. */
export function isSupportedListing(value: unknown): value is MarketplaceListing {
  if (typeof value !== "object" || value === null) return false;
  const l = value as Partial<MarketplaceListing>;
  return (
    l.version === LISTING_VERSION &&
    typeof l.title === "string" && l.title.length > 0 &&
    typeof l.price === "number" && Number.isFinite(l.price) &&
    typeof l.description === "string" &&
    Array.isArray(l.photoUrls) && l.photoUrls.every((u) => typeof u === "string" && u.startsWith("https://"))
  );
}

/** A listing with a `version` this build does not know: the console shows "update the extension". */
export function hasUnknownVersion(value: unknown): boolean {
  return typeof value === "object" && value !== null && (value as { version?: unknown }).version !== LISTING_VERSION;
}
