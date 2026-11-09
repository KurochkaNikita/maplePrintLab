import type { FinanceSummary } from "@maple-print-lab/db";
import KpiCard from "@/components/finance/KpiCard";
import { formatMoney } from "@/lib/finance/format";
import { format, type Dictionary, type Locale } from "@/lib/i18n";

export interface FinanceKpisProps {
  t: Dictionary["pages"]["finance"]["kpi"];
  locale: Locale;
  summary: FinanceSummary;
}

/** Headline numbers of the period: earned, cost of goods, expenses, profit, and the order count. */
export function FinanceKpis({ t, locale, summary }: FinanceKpisProps) {
  const money = (amount: number) => formatMoney(amount, locale);
  const profit = summary.income - summary.itemCost - summary.expenses;
  const average = summary.orderCount ? summary.income / summary.orderCount : 0;

  return (
    <>
      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label={t.income} value={money(summary.income)} hint={t.incomeHint} />
        <KpiCard label={t.itemCost} value={money(summary.itemCost)} hint={t.itemCostHint} />
        <KpiCard label={t.expenses} value={money(summary.expenses)} hint={t.expensesHint} />
        <KpiCard label={t.profit} value={money(profit)} hint={t.profitHint} />
      </dl>
      <p className="text-sm text-ink">
        <span className="font-medium text-charcoal">
          {t.orders}: {summary.orderCount}.
        </span>{" "}
        {format(t.ordersHint, { amount: money(average) })}
      </p>
    </>
  );
}

export default FinanceKpis;
