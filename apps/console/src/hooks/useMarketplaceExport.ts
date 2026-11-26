"use client";

import { useState } from "react";
import type { MarketplaceListing } from "@maple-print-lab/extension/src/listing";
import { isExtensionInstalled, sendToExtension } from "@/lib/marketplace/extension-client";

export type MarketplaceState = "idle" | "sending" | "sent" | "not-installed" | "outdated" | "error";

/** Checks that the extension is installed (ping), then hands it the listing. */
export function useMarketplaceExport(extensionId: string, listing: MarketplaceListing | null) {
  const [state, setState] = useState<MarketplaceState>("idle");

  const exportListing = async () => {
    if (!listing) return;
    setState("sending");
    if (!(await isExtensionInstalled(extensionId))) return setState("not-installed");
    const response = await sendToExtension(extensionId, { type: "listing", listing });
    if (response?.ok) return setState("sent");
    setState(response?.error === "unsupported-version" ? "outdated" : "error");
  };

  return { state, exportListing, reset: () => setState("idle") };
}
