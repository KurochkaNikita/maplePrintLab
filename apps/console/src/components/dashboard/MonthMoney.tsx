import type { FinanceSummary } from "@maple-print-lab/db";
import DashboardSection from "@/components/dashboard/DashboardSection";
import KpiCard from "@/components/finance/KpiCard";
import { compareText } from "@/lib/dashboard/compare";
import { profitOf } from "@/lib/dashboard/stats";
import { formatMoney } from "@/lib/finance/format";
import { format, type Dictionary, type Locale } from "@/lib/i18n";

export interface MonthMoneyProps {
  t: Dictionary["pages"]["dashboard"]["money"];
  locale: Locale;
  /** The last 30 days. */
  current: FinanceSummary;
  /** The 30 days before them. */
  previous: FinanceSummary;
}

/** Earned and profit of the last 30 days against the 30 before, plus money still awaited. */
export function MonthMoney({ t, locale, current, previous }: MonthMoneyProps) {
  const money = (amount: number) => formatMoney(amount, locale);

  return (
    <DashboardSection id="money-heading" title={t.title} more={{ href: "/finance", label: t.all }}>
      <dl className="grid gap-4 sm:grid-cols-3">
        <KpiCard label={t.income} value={money(current.income)} hint={compareText(current.income, previous.income, t, locale)} />
        <KpiCard label={t.profit} value={money(profitOf(current))} hint={compareText(profitOf(current), profitOf(previous), t, locale)} />
        <KpiCard label={t.pending} value={money(current.pending.amount)} hint={format(t.pendingHint, { count: current.pending.orderCount })} />
      </dl>
    </DashboardSection>
  );
}

export default MonthMoney;
