import type { FinanceSeriesPoint, FinanceSummary, Granularity } from "@maple-print-lab/db";
import ButtonLink from "@/components/ButtonLink";
import EmptyState from "@/components/EmptyState";
import FinanceBreakdowns from "@/components/finance/FinanceBreakdowns";
import FinanceKpis from "@/components/finance/FinanceKpis";
import GrowthChartCard from "@/components/finance/GrowthChartCard";
import PeriodChartCard from "@/components/finance/PeriodChartCard";
import PeriodTabs from "@/components/finance/PeriodTabs";
import PageHeader from "@/components/PageHeader";
import { DEFAULT_PERIOD, PERIODS, type PeriodId } from "@/lib/finance/period";
import type { Dictionary, Locale } from "@/lib/i18n";

export interface FinanceScreenProps {
  t: Dictionary;
  locale: Locale;
  period: PeriodId;
  granularity: Granularity;
  summary: FinanceSummary;
  /** One point per bucket of the period, zeros where nothing happened. */
  points: FinanceSeriesPoint[];
  /** Totals per day with activity over all time, for the growth chart. */
  history: FinanceSeriesPoint[];
  /** Today, YYYY-MM-DD (shop time zone). */
  today: string;
}

const periodHref = (period: PeriodId) => (period === DEFAULT_PERIOD ? "/finance" : `/finance?period=${period}`);

/** Earned, spent and profit for a period: headline numbers, two charts, and where the money comes from and goes. */
export function FinanceScreen({ t, locale, period, granularity, summary, points, history, today }: FinanceScreenProps) {
  const p = t.pages.finance;
  const isEmpty = summary.orderCount === 0 && summary.expenses === 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title={p.heading}
        description={p.description}
        actions={
          <>
            <ButtonLink href="/orders/new">{p.addOrder}</ButtonLink>
            <ButtonLink href="/expenses/new" variant="secondary">
              {p.addExpense}
            </ButtonLink>
          </>
        }
      />

      <PeriodTabs
        label={p.period.label}
        periods={PERIODS}
        labels={{ d30: p.period.d30, d90: p.period.d90, m12: p.period.m12, ytd: p.period.ytd }}
        active={period}
        getHref={periodHref}
      />

      {isEmpty ? (
        <EmptyState title={p.empty.title} body={p.empty.body} />
      ) : (
        <>
          <FinanceKpis t={p.kpi} locale={locale} summary={summary} />
          <div className="grid items-start gap-6 xl:grid-cols-2">
            <PeriodChartCard t={p.chart} locale={locale} granularity={granularity} points={points} />
            <GrowthChartCard t={p} locale={locale} history={history} today={today} />
          </div>
          <FinanceBreakdowns t={p.breakdown} locale={locale} summary={summary} />
        </>
      )}
    </div>
  );
}

export default FinanceScreen;
