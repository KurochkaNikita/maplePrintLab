import type { ExtensionRequest, ExtensionResponse } from "@maple-print-lab/extension/src/listing";

/** The slice of `chrome.runtime` a web page can use to talk to an extension (no @types/chrome in the console). */
type ChromeRuntime = {
  sendMessage: (id: string, message: ExtensionRequest, callback: (response?: ExtensionResponse) => void) => void;
  lastError?: unknown;
};

/** Browser only. Resolves to null when there is no extension to answer. */
export const sendToExtension = (extensionId: string, message: ExtensionRequest): Promise<ExtensionResponse | null> =>
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

export const isExtensionInstalled = async (extensionId: string): Promise<boolean> =>
  Boolean((await sendToExtension(extensionId, { type: "ping" }))?.ok);
