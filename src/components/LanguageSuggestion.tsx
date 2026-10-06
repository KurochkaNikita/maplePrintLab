"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeTag, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "mpl-lang-suggestion-dismissed";
const LOCALE_SEGMENT = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

type LanguageSuggestionProps = {
  current: Locale;
  /** The other locale, its name for itself and the message / labels in that language. */
  suggested: { locale: Locale; message: string; cta: string; dismiss: string };
};

/**
 * Offers the page in the visitor's browser language — a dismissible bar, never
 * a redirect. Rendered client-side only after mount, so crawlers and the static
 * HTML never see it (and it can't shift layout: it is fixed to the bottom).
 */
export default function LanguageSuggestion({ current, suggested }: LanguageSuggestionProps) {
  const pathname = usePathname() || `/${current}/`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const preferred = navigator.languages?.[0] ?? navigator.language ?? "";
    const wantsSuggested = preferred.toLowerCase().startsWith(suggested.locale);
    if (wantsSuggested && current !== suggested.locale) setVisible(true);
  }, [current, suggested.locale]);

  if (!visible) return null;

  const rest = pathname.replace(LOCALE_SEGMENT, "") || "/";

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <aside
      lang={localeTag[suggested.locale]}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-5 py-2 shadow-lg"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-charcoal">
        <p>
          {suggested.message}{" "}
          <Link
            href={`/${suggested.locale}${rest}`}
            hrefLang={localeTag[suggested.locale]}
            className="inline-block py-2 font-medium text-teal underline hover:text-amber-deep"
          >
            {suggested.cta}
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="min-h-11 px-3 text-ink/80 underline hover:text-charcoal"
        >
          {suggested.dismiss}
        </button>
      </div>
    </aside>
  );
}
