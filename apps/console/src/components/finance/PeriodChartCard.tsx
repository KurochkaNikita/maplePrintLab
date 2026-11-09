import type { FinanceSeriesPoint, Granularity } from "@maple-print-lab/db";
import ChartCard from "@/components/finance/ChartCard";
import ChartDataTable from "@/components/finance/ChartDataTable";
import ChartLegend from "@/components/finance/ChartLegend";
import EarnedSpentChart from "@/components/finance/EarnedSpentChart";
import type { Dictionary, Locale } from "@/lib/i18n";

export interface PeriodChartCardProps {
  t: Dictionary["pages"]["finance"]["chart"];
  locale: Locale;
  granularity: Granularity;
  /** One point per bucket of the period, zeros where nothing happened. */
  points: FinanceSeriesPoint[];
}

/** Earned and spent per bucket of the chosen period, with its data table. */
export function PeriodChartCard({ t, locale, granularity, points }: PeriodChartCardProps) {
  return (
    <ChartCard id="chart-heading" title={t.title} description={t.description}>
      <div className="mt-4">
        <ChartLegend income={t.income} spent={t.spent} />
      </div>
      <div className="mt-4">
        <EarnedSpentChart
          points={points}
          granularity={granularity}
          locale={locale}
          label={t.ariaLabel}
          income={t.income}
          spent={t.spent}
          weekOf={t.weekOf}
        />
      </div>
      <ChartDataTable
        points={points}
        granularity={granularity}
        locale={locale}
        labels={{ summary: t.tableCaption, bucket: t.bucket, income: t.income, spent: t.spent, profit: t.profit }}
      />
    </ChartCard>
  );
}

export default PeriodChartCard;
