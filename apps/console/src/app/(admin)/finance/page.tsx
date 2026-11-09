import type { Metadata } from "next";
import { createDb, getFinanceHistory, getFinanceSummary } from "@maple-print-lab/db";
import { fillSeries, parsePeriod, periodRange, todayIso } from "@/lib/finance/period";
import { getDict, getLocale } from "@/lib/i18n/server";
import FinanceScreen from "@/screens/finance/FinanceScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.finance.metaTitle };
}

export default async function FinancePage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const query = await searchParams;
  const period = parsePeriod(query.period);
  const range = periodRange(period, todayIso());

  const db = createDb();
  const [t, locale, summary, history] = await Promise.all([getDict(), getLocale(), getFinanceSummary(db, range), getFinanceHistory(db)]);

  return (
    <FinanceScreen
      t={t}
      locale={locale}
      period={period}
      granularity={range.granularity}
      summary={summary}
      points={fillSeries(summary.series, range)}
      history={history}
      today={range.to}
    />
  );
}
