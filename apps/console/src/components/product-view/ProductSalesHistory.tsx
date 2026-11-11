import type { Page, ProductSaleLine } from "@maple-print-lab/db";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import ListPagination from "@/components/ListPagination";
import { formatDate, formatMoney } from "@/lib/finance/format";
import type { Dictionary, Locale } from "@/lib/i18n";
import { lineProfit } from "@/lib/products/margin";

export interface ProductSalesHistoryProps {
  t: Dictionary["pages"]["products"]["view"]["history"];
  locale: Locale;
  productId: number;
  lines: Page<ProductSaleLine>;
  pageSize: number;
}

const numeric = "text-right tabular-nums whitespace-nowrap";

/** Order lines with this product, newest first, one page at a time (`?page=`). */
export function ProductSalesHistory({ t, locale, productId, lines, pageSize }: ProductSalesHistoryProps) {
  const money = (amount: number) => formatMoney(amount, locale);
  const getHref = (page: number) => (page > 1 ? `/products/${productId}?page=${page}` : `/products/${productId}`);

  const columns: DataTableColumn<ProductSaleLine>[] = [
    { id: "date", header: t.date, rowHeader: true, className: "whitespace-nowrap", cell: (l) => formatDate(l.orderedOn, locale) },
    { id: "channel", header: t.channel, cell: (l) => l.channel },
    { id: "quantity", header: t.quantity, className: numeric, headerClassName: "text-right", cell: (l) => l.quantity },
    { id: "price", header: t.unitPrice, className: numeric, headerClassName: "text-right", cell: (l) => money(l.unitPrice) },
    {
      id: "cost",
      header: t.unitCost,
      className: numeric,
      headerClassName: "text-right",
      cell: (l) => (l.unitCost === 0 ? <span className="whitespace-normal text-charcoal">{t.noCost}</span> : money(l.unitCost)),
    },
    { id: "profit", header: t.profit, className: numeric, headerClassName: "text-right", cell: (l) => money(lineProfit(l.quantity, l.unitPrice, l.unitCost)) },
  ];

  return (
    <section aria-labelledby="product-history-heading" className="space-y-3">
      <h2 id="product-history-heading" className="font-display text-lg font-semibold text-charcoal">{t.heading}</h2>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <DataTable
          caption={t.tableLabel}
          columns={columns}
          rows={lines.items}
          getRowKey={(l) => l.id}
          getRowHref={(l) => `/orders/${l.orderId}`}
          minWidthClassName="min-w-[42rem]"
        />
        <ListPagination
          labels={t.pagination}
          getHref={getHref}
          page={lines.page}
          pageCount={lines.pageCount}
          pageSize={pageSize}
          total={lines.total}
          count={lines.items.length}
        />
      </div>
    </section>
  );
}

export default ProductSalesHistory;
