import { LISTING_VERSION, STORAGE_KEY, hasUnknownVersion, isSupportedListing, type ExtensionRequest, type ExtensionResponse } from "./listing";

const FORM_URL = "https://www.facebook.com/marketplace/create/item";
const ADMIN_ORIGINS = ["https://admin.mapleprintlab.store"];
const DEV_ORIGIN = /^https?:\/\/localhost(:\d+)?$/;

// Content scripts may not read storage.session by default.
void chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" });


const isAllowedOrigin = (origin: string | undefined): boolean =>
  !!origin && (ADMIN_ORIGINS.includes(origin) || DEV_ORIGIN.test(origin));

/** Messages from the admin only. `externally_connectable` already filters by URL; this is the second check. */
chrome.runtime.onMessageExternal.addListener(
  (message: ExtensionRequest, sender, sendResponse: (r: ExtensionResponse) => void) => {
    if (!isAllowedOrigin(sender.origin)) return; // ignore silently

    if (message?.type === "ping") {
      sendResponse({ ok: true, version: LISTING_VERSION });
      return;
    }
    if (message?.type === "listing") {
      if (hasUnknownVersion(message.listing)) {
        sendResponse({ ok: false, error: "unsupported-version" });
        return;
      }
      if (!isSupportedListing(message.listing)) {
        sendResponse({ ok: false, error: "invalid-listing" });
        return;
      }
      void chrome.storage.session
        .set({ [STORAGE_KEY]: message.listing })
        .then(() => chrome.tabs.create({ url: FORM_URL }))
        .then(() => sendResponse({ ok: true, version: LISTING_VERSION }))
        .catch(() => sendResponse({ ok: false, error: "invalid-listing" }));
      return true; // async response
    }
    sendResponse({ ok: false, error: "unknown-message" });
  },
);
