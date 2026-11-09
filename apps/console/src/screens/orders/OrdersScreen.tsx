import type { OrderListItem } from "@maple-print-lab/db";
import ButtonLink from "@/components/ButtonLink";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import ListPagination from "@/components/ListPagination";
import PageHeader from "@/components/PageHeader";
import { formatDate, formatMoney } from "@/lib/finance/format";
import type { Dictionary, Locale } from "@/lib/i18n";

export interface OrdersScreenProps {
  t: Dictionary;
  locale: Locale;
  orders: OrderListItem[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

const getHref = (page: number) => (page > 1 ? `/orders?page=${page}` : "/orders");
const numeric = "text-right tabular-nums whitespace-nowrap";

export function OrdersScreen({ t, locale, orders, total, page, pageCount, pageSize }: OrdersScreenProps) {
  const p = t.pages.orders;
  const money = (amount: number) => formatMoney(amount, locale);

  const columns: DataTableColumn<OrderListItem>[] = [
    { id: "date", header: p.list.columns.date, rowHeader: true, className: "whitespace-nowrap", cell: (o) => formatDate(o.orderedOn, locale) },
    { id: "items", header: p.list.columns.items, className: "max-w-xs truncate", cell: (o) => o.summary || "—" },
    { id: "channel", header: p.list.columns.channel, cell: (o) => o.channelName },
    { id: "revenue", header: p.list.columns.revenue, className: numeric, headerClassName: "text-right", cell: (o) => money(o.revenue) },
    { id: "cost", header: p.list.columns.cost, className: numeric, headerClassName: "text-right", cell: (o) => money(o.cost) },
    { id: "profit", header: p.list.columns.profit, className: numeric, headerClassName: "text-right", cell: (o) => money(o.revenue - o.cost) },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title={p.heading} description={p.description} actions={<ButtonLink href="/orders/new">{p.list.newButton}</ButtonLink>} />

      {total === 0 ? (
        <EmptyState title={p.list.emptyTitle} body={p.list.emptyBody} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <DataTable caption={p.list.tableLabel} columns={columns} rows={orders} getRowKey={(o) => o.id} getRowHref={(o) => `/orders/${o.id}`} minWidthClassName="min-w-[40rem]" />
          <ListPagination labels={p.list.pagination} getHref={getHref} page={page} pageCount={pageCount} pageSize={pageSize} total={total} count={orders.length} />
        </div>
      )}
    </div>
  );
}

export default OrdersScreen;
