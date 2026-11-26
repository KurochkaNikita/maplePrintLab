/**
 * Listing defaults that are not stored with the product. Change them here (or via env) and nowhere else.
 */
export const MARKETPLACE_DEFAULTS = {
  /** Category path as shown in the Facebook form (English UI). */
  category: "",
  /** Default city for the listing; empty means "leave it to the form". */
  location: process.env.NEXT_PUBLIC_MARKETPLACE_CITY ?? "",
  /** "Ready in N days". */
  leadTimeDays: 5,
};

/** Unlisted Chrome Web Store item: it can be installed only from this link. */
export const MARKETPLACE_EXTENSION_STORE_URL =
  "https://chromewebstore.google.com/detail/maple-print-lab-marketpla/kiopiinjlnboipacmnbeelpdkkaadgeg";

export const MARKETPLACE_EXTENSION_ID = process.env.NEXT_PUBLIC_MARKETPLACE_EXTENSION_ID ?? "";
