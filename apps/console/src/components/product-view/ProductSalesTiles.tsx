import type { ProductSalesSummary } from "@maple-print-lab/db";
import KpiCard from "@/components/finance/KpiCard";
import { formatDate, formatMoney } from "@/lib/finance/format";
import { format, type Dictionary, type Locale } from "@/lib/i18n";

export interface ProductSalesTilesProps {
  t: Dictionary["pages"]["products"]["view"]["sales"];
  locale: Locale;
  summary: ProductSalesSummary;
}

/** Units, revenue, gross profit, order count and last sale date, plus a note when some lines have no cost. */
export function ProductSalesTiles({ t, locale, summary }: ProductSalesTilesProps) {
  return (
    <div className="space-y-3">
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard compact label={t.units} value={new Intl.NumberFormat(locale).format(summary.units)} />
        <KpiCard compact label={t.revenue} value={formatMoney(summary.revenue, locale)} />
        <KpiCard compact label={t.profit} value={formatMoney(summary.profit, locale)} />
        <KpiCard compact label={t.orders} value={new Intl.NumberFormat(locale).format(summary.orders)} />
        <KpiCard compact label={t.lastSold} value={summary.lastSoldOn ? formatDate(summary.lastSoldOn, locale) : "—"} />
      </dl>
      <p className="text-sm text-ink">{t.scopeNote}</p>
      {summary.linesWithoutCost > 0 && (
        <p className="text-sm font-medium text-charcoal">{format(t.noCostNote, { count: summary.linesWithoutCost })}</p>
      )}
    </div>
  );
}

export default ProductSalesTiles;
