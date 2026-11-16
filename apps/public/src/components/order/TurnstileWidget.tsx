"use client";

import { useEffect, useRef } from "react";
import { loadTurnstile } from "@/lib/order/turnstile";

type TurnstileWidgetProps = {
  siteKey: string;
  /** Turnstile `language` code ("en", "fr"). */
  language: string;
  /** Called with a fresh token, or "" when it expired or the check failed. */
  onToken: (token: string) => void;
};

/** Cloudflare Turnstile challenge. Mount it again (new `key`) to get a new token after a failed attempt. */
export default function TurnstileWidget({ siteKey, language, onToken }: TurnstileWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let widgetId: string | undefined;
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !container.current) return;
        widgetId = turnstile.render(container.current, {
          sitekey: siteKey,
          language,
          callback: onToken,
          "expired-callback": () => onToken(""),
          "error-callback": () => onToken(""),
        });
      })
      .catch(() => onToken(""));
    return () => {
      cancelled = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [siteKey, language, onToken]);

  return <div ref={container} className="min-h-[65px]" />;
}
