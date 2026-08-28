"use client";

import { useEffect } from "react";
import { locales, defaultLocale } from "@/lib/i18n";

/** Client-side "/" -> "/<best-locale>/" redirect. Renders nothing. */
export default function RootRedirect() {
  useEffect(() => {
    try {
      const supported = locales as readonly string[];
      const list = navigator.languages ?? [navigator.language];
      const pick =
        list
          .map((l) => String(l).toLowerCase().split("-")[0])
          .find((l) => supported.includes(l)) ?? defaultLocale;
      window.location.replace(`/${pick}/`);
    } catch {
      window.location.replace(`/${defaultLocale}/`);
    }
  }, []);

  return null;
}
