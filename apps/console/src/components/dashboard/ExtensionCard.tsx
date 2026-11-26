"use client";

import IconButton from "@/components/IconButton";
import ExtensionStoreLink from "@/components/marketplace/ExtensionStoreLink";
import { useExtensionCard } from "@/hooks/useExtensionCard";
import CloseIcon from "@/icons/close.svg";
import type { Dictionary } from "@/lib/i18n";
import { MARKETPLACE_EXTENSION_ID } from "@/lib/marketplace/defaults";

export interface ExtensionCardProps {
  t: Dictionary["pages"]["dashboard"]["extension"];
}

/** Reminds the admin to install the Chrome extension that fills the Marketplace form. */
export function ExtensionCard({ t }: ExtensionCardProps) {
  const { visible, dismiss } = useExtensionCard(MARKETPLACE_EXTENSION_ID);
  if (!visible) return null;

  return (
    <section aria-labelledby="dashboard-extension-heading" className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-yellow-700/40 bg-yellow-50 p-5">
      <div className="min-w-0 space-y-1">
        <h2 id="dashboard-extension-heading" className="font-display text-lg font-semibold text-charcoal">{t.title}</h2>
        <p className="max-w-2xl text-sm text-ink">{t.body}</p>
      </div>
      <div className="flex items-center gap-2">
        <ExtensionStoreLink label={t.link} newTab={t.newTab} />
        <IconButton icon={CloseIcon} label={t.hide} onClick={dismiss} />
      </div>
    </section>
  );
}

export default ExtensionCard;
