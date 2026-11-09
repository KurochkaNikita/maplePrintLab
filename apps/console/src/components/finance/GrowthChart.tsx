import type { FinanceSeriesPoint } from "@maple-print-lab/db";
import LineChart from "@/components/finance/LineChart";
import { formatBucket, formatDate } from "@/lib/finance/format";
import { addDays } from "@/lib/finance/period";
import type { Locale } from "@/lib/i18n";

export interface GrowthChartProps {
  /** Totals per day with activity, oldest first (gaps are fine). */
  days: FinanceSeriesPoint[];
  today: string;
  locale: Locale;
  label: string;
  income: string;
  spent: string;
  profit: string;
}

const dayNumber = (iso: string) => Math.round(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);

/** Running totals since the first order: earned, spent and profit, as three smooth lines. */
export function GrowthChart({ days, today, locale, label, income, spent, profit }: GrowthChartProps) {
  if (days.length === 0) return null;
  const start = addDays(days[0].bucket, -1);
  const dates = [start, ...days.map((d) => d.bucket)];
  if (dates[dates.length - 1] < today) dates.push(today);
  const byDate = new Map(days.map((d) => [d.bucket, d]));

  let earned = 0;
  let cost = 0;
  const totals = dates.map((date) => {
    const d = byDate.get(date);
    earned += d?.income ?? 0;
    cost += (d?.itemCost ?? 0) + (d?.expenses ?? 0);
    return { earned, cost };
  });

  const xs = dates.map(dayNumber);
  const ticks: { x: number; label: string }[] = [{ x: xs[0], label: formatBucket(dates[0], "day", locale) }];
  const [y, m] = dates[0].split("-").map(Number);
  const last = dates[dates.length - 1];
  for (let year = y, month = m + 1; ; month++) {
    if (month > 12) {
      month = 1;
      year++;
    }
    const first = `${year}-${String(month).padStart(2, "0")}-01`;
    if (first >= last) break;
    ticks.push({ x: dayNumber(first), label: formatBucket(first, "month", locale) });
  }
  const step = Math.ceil(ticks.length / 5);

  return (
    <LineChart
      xs={xs}
      titles={dates.map((d) => formatDate(d, locale))}
      ticks={ticks.filter((_, i) => i % step === 0)}
      series={[
        { id: "income", label: income, tone: "income", values: totals.map((t) => t.earned) },
        { id: "spent", label: spent, tone: "spent", values: totals.map((t) => t.cost) },
        { id: "profit", label: profit, tone: "profit", values: totals.map((t) => t.earned - t.cost) },
      ]}
      locale={locale}
      label={label}
    />
  );
}

export default GrowthChart;
