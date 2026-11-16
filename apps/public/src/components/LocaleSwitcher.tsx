"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeLabel, localeTag, type Locale } from "@/lib/i18n";

const LOCALE_SEGMENT = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

type LocaleSwitcherProps = {
  current: Locale;
  label: string;
  /** "dark" for the charcoal footer. */
  tone?: "light" | "dark";
};

const TONES = {
  light: { current: "text-charcoal", link: "text-ink/80 hover:text-amber-deep", separator: "text-line" },
  dark: { current: "text-filament", link: "text-filament/70 hover:text-amber", separator: "text-filament/30" },
} as const;

export default function LocaleSwitcher({ current, label, tone = "light" }: LocaleSwitcherProps) {
  const colors = TONES[tone];
  const pathname = usePathname() || `/${current}/`;
  // Path within the current locale, e.g. "/en/product/" -> "/product/", "/en/" -> "/"
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
            <span aria-hidden="true" className={colors.separator}>
              ·
            </span>
          )}
          {locale === current ? (
            <span aria-current="true" className={colors.current}>
              {localeLabel[locale]}
            </span>
          ) : (
            <Link
              href={`/${locale}${suffix}`}
              hrefLang={localeTag[locale]}
              className={`inline-block px-1 py-2 transition-colors ${colors.link}`}
            >
              {localeLabel[locale]}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
