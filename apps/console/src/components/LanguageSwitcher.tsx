"use client";

import { useRouter } from "next/navigation";
import { useLocale, useT } from "@/components/LocaleProvider";
import { isLocale, LOCALE_COOKIE, localeLabels, locales } from "@/lib/i18n";
import ChevronDownSolidIcon from "@/icons/chevron-down-solid.svg";
import GlobeIcon from "@/icons/globe.svg";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useT();

  function change(value: string) {
    if (!isLocale(value)) return;
    document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className={`relative inline-flex items-center ${className}`.trim()}>
      <GlobeIcon className="pointer-events-none absolute left-3.5 h-5 w-5 text-ink" />
      <select
        aria-label={t.a11y.language}
        value={locale}
        onChange={(e) => change(e.target.value)}
        className="min-h-11 w-full cursor-pointer appearance-none rounded-xl border border-charcoal/25 bg-white py-2 pl-11 pr-9 text-sm font-medium text-charcoal transition-colors hover:border-charcoal"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeLabels[l]}
          </option>
        ))}
      </select>
      <ChevronDownSolidIcon className="pointer-events-none absolute right-3 h-4 w-4 text-ink" />
    </div>
  );
}

export default LanguageSwitcher;
