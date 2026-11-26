import { formatMoney } from "@/lib/finance/format";
import { format, type Dictionary, type Locale } from "@/lib/i18n";

/** "X more / less than the previous 30 days", in words so that no sign or colour is needed to read it. */
export function compareText(current: number, previous: number, t: Dictionary["pages"]["dashboard"]["money"], locale: Locale): string {
  // Whole cents: floating-point leftovers must not read as a change.
  const cents = Math.round((current - previous) * 100);
  if (cents === 0) return t.same;
  return format(cents > 0 ? t.more : t.less, { amount: formatMoney(Math.abs(cents) / 100, locale) });
}
