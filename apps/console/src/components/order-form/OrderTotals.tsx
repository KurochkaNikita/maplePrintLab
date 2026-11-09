"use client";

import { useLocale, useT } from "@/components/LocaleProvider";
import { formatMoney } from "@/lib/finance/format";

export interface OrderTotalsProps {
  revenue: number;
  cost: number;
  profit: number;
}

/** Sums of the order as typed so far. */
export function OrderTotals({ revenue, cost, profit }: OrderTotalsProps) {
  const t = useT().pages.orders.form.totals;
  const locale = useLocale();
  const rows = [
    { label: t.revenue, value: revenue },
    { label: t.cost, value: cost },
    { label: t.profit, value: profit },
  ];

  return (
    <section aria-label={t.label} className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-6">
      <h2 className="font-display text-lg font-semibold text-charcoal">{t.label}</h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-sm text-ink">{row.label}</dt>
            <dd className="font-display text-xl font-semibold tabular-nums text-charcoal">{formatMoney(row.value, locale)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default OrderTotals;
