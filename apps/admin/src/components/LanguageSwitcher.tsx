"use client";

import { useRouter } from "next/navigation";
import { useLocale, useT } from "@/components/LocaleProvider";
import { isLocale, LOCALE_COOKIE, localeLabels, locales } from "@/lib/i18n";

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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 h-5 w-5 text-ink"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
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
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="pointer-events-none absolute right-3 h-4 w-4 text-ink"
      >
        <path
          fillRule="evenodd"
          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default LanguageSwitcher;
