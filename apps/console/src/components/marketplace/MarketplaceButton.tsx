"use client";

import type { MarketplaceListing } from "@maple-print-lab/extension/src/listing";
import IconButton from "@/components/IconButton";
import StoreIcon from "@/icons/store.svg";
import { useMarketplaceExport } from "@/hooks/useMarketplaceExport";
import type { Dictionary } from "@/lib/i18n";
import MarketplaceInstallModal from "./MarketplaceInstallModal";

export interface MarketplaceButtonProps {
  t: Dictionary["pages"]["products"]["view"]["marketplace"];
  /** Null when the product lacks an English title, a price or a photo. */
  listing: MarketplaceListing | null;
  extensionId: string;
}

/** Sends the product to the Chrome extension, which fills the Facebook Marketplace form. */
export function MarketplaceButton({ t, listing, extensionId }: MarketplaceButtonProps) {
  const { state, exportListing, reset } = useMarketplaceExport(extensionId, listing);
  const message = !listing ? t.missingData : { sent: t.sent, outdated: t.outdated, error: t.error, sending: "", idle: "", "not-installed": "" }[state];

  return (
    <div className="flex flex-col items-end gap-1">
      <IconButton
        variant="outline"
        icon={StoreIcon}
        label={state === "sending" ? t.sending : t.button}
        onClick={exportListing}
        disabled={!listing}
        loading={state === "sending"}
      />
      {/* Always rendered, so screen readers announce the text when it changes. */}
      <p role="status" aria-live="polite" className="max-w-xs text-right text-sm text-ink empty:hidden">{message}</p>
      {state === "not-installed" && <MarketplaceInstallModal t={t} onClose={reset} />}
    </div>
  );
}

export default MarketplaceButton;
