"use client";

import { useEffect, useState } from "react";
import { hideExtensionCardCookie, isExtensionCardHidden } from "@/lib/marketplace/extension-card-cookie";
import { isExtensionInstalled } from "@/lib/marketplace/extension-client";

/** Whether to advertise the extension: not when it is installed or the card was closed in the last 30 days. */
export function useExtensionCard(extensionId: string) {
  // Hidden until checked, so people who have the extension never see the card flash.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isExtensionCardHidden(document.cookie)) return;
    let active = true;
    void isExtensionInstalled(extensionId).then((installed) => {
      if (active) setVisible(!installed);
    });
    return () => {
      active = false;
    };
  }, [extensionId]);

  const dismiss = () => {
    document.cookie = hideExtensionCardCookie();
    setVisible(false);
  };

  return { visible, dismiss };
}
