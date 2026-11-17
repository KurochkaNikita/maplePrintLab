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

export const MARKETPLACE_EXTENSION_ID = process.env.NEXT_PUBLIC_MARKETPLACE_EXTENSION_ID ?? "";
