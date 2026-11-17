"use client";

import { useState } from "react";
import type { ExtensionRequest, ExtensionResponse, MarketplaceListing } from "@maple-print-lab/extension/src/listing";

export type MarketplaceState = "idle" | "sending" | "sent" | "not-installed" | "outdated" | "error";

/** The slice of `chrome.runtime` a web page can use to talk to an extension (no @types/chrome in the console). */
type ChromeRuntime = {
  sendMessage: (id: string, message: ExtensionRequest, callback: (response?: ExtensionResponse) => void) => void;
  lastError?: unknown;
};

const send = (extensionId: string, message: ExtensionRequest): Promise<ExtensionResponse | null> =>
  new Promise((resolve) => {
    const runtime = (window as unknown as { chrome?: { runtime?: ChromeRuntime } }).chrome?.runtime;
    if (!extensionId || !runtime?.sendMessage) return resolve(null);
    try {
      runtime.sendMessage(extensionId, message, (response) => {
        void runtime.lastError; // reading it marks the error as handled
        resolve(response ?? null);
      });
    } catch {
      resolve(null);
    }
  });

/** Checks that the extension is installed (ping), then hands it the listing. */
export function useMarketplaceExport(extensionId: string, listing: MarketplaceListing | null) {
  const [state, setState] = useState<MarketplaceState>("idle");

  const exportListing = async () => {
    if (!listing) return;
    setState("sending");
    if (!(await send(extensionId, { type: "ping" }))?.ok) return setState("not-installed");
    const response = await send(extensionId, { type: "listing", listing });
    if (response?.ok) return setState("sent");
    setState(response?.error === "unsupported-version" ? "outdated" : "error");
  };

  return { state, exportListing, reset: () => setState("idle") };
}
