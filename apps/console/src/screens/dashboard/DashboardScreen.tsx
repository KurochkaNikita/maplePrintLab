import type { FinanceSummary, OrderListItem, OrderStageCounts, PopularItem } from "@maple-print-lab/db";
import AttentionBlock from "@/components/dashboard/AttentionBlock";
import ExtensionCard from "@/components/dashboard/ExtensionCard";
import MonthMoney from "@/components/dashboard/MonthMoney";
import OrderQueue from "@/components/dashboard/OrderQueue";
import PopularItems from "@/components/dashboard/PopularItems";
import QuickActions from "@/components/dashboard/QuickActions";
import PageHeader from "@/components/PageHeader";
import type { Dictionary, Locale } from "@/lib/i18n";

export interface DashboardScreenProps {
  t: Dictionary;
  locale: Locale;
  /** Today, YYYY-MM-DD (shop time zone). */
  today: string;
  newRequests: number;
  stages: OrderStageCounts;
  /** The first orders not handed over yet. */
  queue: OrderListItem[];
  /** The last 30 days. */
  current: FinanceSummary;
  /** The 30 days before them. */
  previous: FinanceSummary;
  popular: PopularItem[];
}

/** Home of the admin: what needs doing today and how the last 30 days went. */
export function DashboardScreen({ t, locale, today, newRequests, stages, queue, current, previous, popular }: DashboardScreenProps) {
  const p = t.pages.dashboard;

  return (
    <div className="space-y-8">
      <PageHeader title={p.heading} description={p.description} />
      <QuickActions t={p.actions} />
      <ExtensionCard t={p.extension} />
      <AttentionBlock t={p.attention} newRequests={newRequests} stages={stages} />
      <OrderQueue t={p.queue} statusLabels={t.pages.orders.status} locale={locale} orders={queue} today={today} />
      <MonthMoney t={p.money} locale={locale} current={current} previous={previous} />
      <PopularItems t={p.popular} items={popular} />
    </div>
  );
}

export default DashboardScreen;
