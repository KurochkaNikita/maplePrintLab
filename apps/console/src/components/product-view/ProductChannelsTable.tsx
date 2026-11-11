import type { ProductSalesChannel } from "@maple-print-lab/db";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import { formatMoney } from "@/lib/finance/format";
import type { Dictionary, Locale } from "@/lib/i18n";

export interface ProductChannelsTableProps {
  t: Dictionary["pages"]["products"]["view"]["channels"];
  locale: Locale;
  channels: ProductSalesChannel[];
}

const numeric = "text-right tabular-nums whitespace-nowrap";

/** Sales of the product per sales channel, biggest revenue first (the query sorts). */
export function ProductChannelsTable({ t, locale, channels }: ProductChannelsTableProps) {
  const columns: DataTableColumn<ProductSalesChannel>[] = [
    { id: "channel", header: t.channel, cell: (c) => c.name },
    { id: "units", header: t.units, className: numeric, headerClassName: "text-right", cell: (c) => new Intl.NumberFormat(locale).format(c.units) },
    { id: "revenue", header: t.revenue, className: numeric, headerClassName: "text-right", cell: (c) => formatMoney(c.revenue, locale) },
    { id: "profit", header: t.profit, className: numeric, headerClassName: "text-right", cell: (c) => formatMoney(c.profit, locale) },
  ];

  return (
    <section aria-labelledby="product-channels-heading" className="space-y-3">
      <h2 id="product-channels-heading" className="font-display text-lg font-semibold text-charcoal">{t.heading}</h2>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <DataTable caption={t.tableLabel} columns={columns} rows={channels} getRowKey={(c) => c.channelId} minWidthClassName="min-w-[24rem]" />
      </div>
    </section>
  );
}

export default ProductChannelsTable;
