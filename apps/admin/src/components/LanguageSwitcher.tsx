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
    <select
      aria-label={t.a11y.language}
      value={locale}
      onChange={(e) => change(e.target.value)}
      className={`min-h-11 rounded-lg border border-ink/60 bg-white px-3 text-sm font-medium text-charcoal hover:border-charcoal ${className}`.trim()}
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {localeLabels[l]}
        </option>
      ))}
    </select>
  );
}

export default LanguageSwitcher;
