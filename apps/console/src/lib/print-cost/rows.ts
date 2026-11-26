import type { PrintJob } from "@maple-print-lab/db/src/print-job";
import { formatMoney } from "@/lib/finance/format";
import { format, type Locale } from "@/lib/i18n";
import type { PrintCostStrings } from "@/lib/i18n/print-cost/ru";
import { energyKwh, wearPerHour } from "./calc";
import { POWER_RATE_PER_KWH } from "./rates";

/** The labelled amounts that add up to the cost of one piece. "Other" is left out when it is zero. */
export function printCostRows(job: PrintJob, t: PrintCostStrings, locale: Locale) {
  const money = (amount: number) => formatMoney(amount, locale);
  const kwh = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(energyKwh(job.printer, job.minutes));
  const rows = [
    { id: "plastic", label: t.plastic, value: money(job.plastic) },
    { id: "electricity", label: format(t.electricity, { kwh, rate: money(POWER_RATE_PER_KWH) }), value: money(job.electricity) },
    { id: "wear", label: format(t.wear, { rate: money(wearPerHour(job.printer)) }), value: money(job.wear) },
  ];
  return job.other ? [...rows, { id: "other", label: t.other, value: money(job.other) }] : rows;
}
