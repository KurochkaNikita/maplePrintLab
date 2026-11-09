import type { FinanceSeriesPoint, Granularity } from "@maple-print-lab/db";
import LineChart from "@/components/finance/LineChart";
import { formatBucket } from "@/lib/finance/format";
import { format, type Locale } from "@/lib/i18n";

export interface EarnedSpentChartProps {
  /** One point per bucket, gaps already filled. */
  points: FinanceSeriesPoint[];
  granularity: Granularity;
  locale: Locale;
  /** Accessible name of the picture. */
  label: string;
  income: string;
  spent: string;
  /** "Week of {date}" */
  weekOf: string;
}

/** Earned and spent per period as two smooth lines. */
export function EarnedSpentChart({ points, granularity, locale, label, income, spent, weekOf }: EarnedSpentChartProps) {
  const names = points.map((p) => formatBucket(p.bucket, granularity, locale));
  const step = Math.ceil(points.length / 5);
  return (
    <LineChart
      xs={points.map((_, i) => i)}
      titles={names.map((n) => (granularity === "week" ? format(weekOf, { date: n }) : n))}
      ticks={names.flatMap((n, i) => (i % step === 0 ? [{ x: i, label: n }] : []))}
      series={[
        { id: "income", label: income, tone: "income", values: points.map((p) => p.income) },
        { id: "spent", label: spent, tone: "spent", values: points.map((p) => p.itemCost + p.expenses) },
      ]}
      locale={locale}
      label={label}
    />
  );
}

export default EarnedSpentChart;
