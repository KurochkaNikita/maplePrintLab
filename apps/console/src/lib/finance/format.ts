import type { Locale } from "@/lib/i18n";
import type { Granularity } from "@maple-print-lab/db";

const INTL_LOCALE: Record<Locale, string> = { ru: "ru-CA", en: "en-CA", fr: "fr-CA" };

export function formatMoney(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], { style: "currency", currency: "CAD" }).format(amount);
}

/** Short amount for chart axes: 1 200 → "1.2k". */
export function formatCompactMoney(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], { notation: "compact", maximumFractionDigits: 1 }).format(amount);
}

/** A YYYY-MM-DD string shown as a date; the time zone is fixed so the day never shifts. */
export function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "medium", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Label of a chart bucket: a day, the first day of a week, or a month. */
export function formatBucket(iso: string, granularity: Granularity, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  const options: Intl.DateTimeFormatOptions =
    granularity === "month" ? { month: "short", year: "2-digit", timeZone: "UTC" } : { day: "numeric", month: "short", timeZone: "UTC" };
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], options).format(new Date(Date.UTC(y, m - 1, d)));
}
