"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeLabel, localeTag, type Locale } from "@/lib/i18n";

const LOCALE_SEGMENT = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

type LocaleSwitcherProps = {
  current: Locale;
  label: string;
};

export default function LocaleSwitcher({ current, label }: LocaleSwitcherProps) {
  const pathname = usePathname() || `/${current}/`;
  // Path within the current locale, e.g. "/en/work/" -> "/work/", "/en/" -> "/"
  const rest = pathname.replace(LOCALE_SEGMENT, "") || "/";
  const suffix = rest === "/" ? "/" : rest;

  return (
    <div
      className="flex items-center gap-1.5 font-mono text-xs uppercase"
      role="group"
      aria-label={label}
    >
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden="true" className="text-line">
              ·
            </span>
          )}
          {locale === current ? (
            <span aria-current="true" className="text-charcoal">
              {localeLabel[locale]}
            </span>
          ) : (
            <Link
              href={`/${locale}${suffix}`}
              hrefLang={localeTag[locale]}
              className="text-ink/50 transition-colors hover:text-amber"
            >
              {localeLabel[locale]}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
