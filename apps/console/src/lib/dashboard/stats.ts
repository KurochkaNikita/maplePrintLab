import type { FinanceSummary } from "@maple-print-lab/db";
import { addDays, type PeriodRange } from "@/lib/finance/period";

/** The 30 days right before the last 30 (today included in the latter). */
export const previousMonthRange = (today: string): PeriodRange => ({ from: addDays(today, -59), to: addDays(today, -30), granularity: "day" });

export const profitOf = (summary: FinanceSummary) => summary.income - summary.itemCost - summary.expenses;

/** Whole days from `from` to `today` (both YYYY-MM-DD); 0 for today and for future dates. */
export const daysSince = (from: string, today: string) => Math.max(0, Math.round((Date.parse(today) - Date.parse(from)) / 86_400_000));
