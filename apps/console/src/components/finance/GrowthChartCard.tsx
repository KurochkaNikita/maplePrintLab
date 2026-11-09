import type { FinanceSeriesPoint } from "@maple-print-lab/db";
import ChartCard from "@/components/finance/ChartCard";
import ChartLegend from "@/components/finance/ChartLegend";
import GrowthChart from "@/components/finance/GrowthChart";
import type { Dictionary, Locale } from "@/lib/i18n";

export interface GrowthChartCardProps {
  /** `chart` has the series names, `growth` the heading and labels. */
  t: Dictionary["pages"]["finance"];
  locale: Locale;
  /** Totals per day with activity over all time. */
  history: FinanceSeriesPoint[];
  /** Today, YYYY-MM-DD (shop time zone). */
  today: string;
}

/** Running totals of earned, spent and profit since the first order. */
export function GrowthChartCard({ t, locale, history, today }: GrowthChartCardProps) {
  const { income, spent, profit } = t.chart;
  return (
    <ChartCard id="growth-heading" title={t.growth.title} description={t.growth.description}>
      <div className="mt-4">
        <ChartLegend income={income} spent={spent} profit={profit} />
      </div>
      <div className="mt-4">
        <GrowthChart days={history} today={today} locale={locale} label={t.growth.ariaLabel} income={income} spent={spent} profit={profit} />
      </div>
    </ChartCard>
  );
}

export default GrowthChartCard;
