/** The latest listing sent to the form, kept for the popup. Session storage only: gone when the browser closes. */
import type { MarketplaceListing } from "./listing";
import type { OverlayRow } from "./content/overlay";

export const LAST_FILL_KEY = "lastFill";

export type LastFill = { listing: MarketplaceListing } & (
  | { state: "filling" }
  | { state: "done"; rows: OverlayRow[] }
  | { state: "form-not-found" }
);

export const saveLastFill = (lastFill: LastFill): Promise<void> => chrome.storage.session.set({ [LAST_FILL_KEY]: lastFill });

export async function readLastFill(): Promise<LastFill | null> {
  const stored = (await chrome.storage.session.get(LAST_FILL_KEY))[LAST_FILL_KEY];
  return (stored as LastFill | undefined) ?? null;
}
