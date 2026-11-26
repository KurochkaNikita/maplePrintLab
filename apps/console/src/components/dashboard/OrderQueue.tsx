import type { OrderListItem } from "@maple-print-lab/db";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import DashboardSection from "@/components/dashboard/DashboardSection";
import OrderStatusIcon from "@/components/orders/OrderStatusIcon";
import { daysSince } from "@/lib/dashboard/stats";
import { formatDate, formatMoney } from "@/lib/finance/format";
import { format, type Dictionary, type Locale } from "@/lib/i18n";

export interface OrderQueueProps {
  t: Dictionary["pages"]["dashboard"]["queue"];
  statusLabels: Dictionary["pages"]["orders"]["status"];
  locale: Locale;
  orders: OrderListItem[];
  /** Today, YYYY-MM-DD (shop time zone). */
  today: string;
}

const nowrap = "whitespace-nowrap tabular-nums";

/** The first orders still to be handed over; a click on a row opens the order. */
export function OrderQueue({ t, statusLabels, locale, orders, today }: OrderQueueProps) {
  const waiting = (orderedOn: string) => {
    const days = daysSince(orderedOn, today);
    return days ? format(t.days, { count: days }) : t.today;
  };
  const columns: DataTableColumn<OrderListItem>[] = [
    { id: "items", header: t.columns.items, rowHeader: true, cell: (o) => o.summary || "—" },
    { id: "status", header: t.columns.status, cell: (o) => o.status && <OrderStatusIcon status={o.status} label={statusLabels[o.status]} /> },
    { id: "date", header: t.columns.date, className: nowrap, cell: (o) => formatDate(o.orderedOn, locale) },
    { id: "waiting", header: t.columns.waiting, className: nowrap, cell: (o) => waiting(o.orderedOn) },
    { id: "amount", header: t.columns.amount, className: `text-right ${nowrap}`, headerClassName: "text-right", cell: (o) => formatMoney(o.revenue, locale) },
  ];

  return (
    <DashboardSection id="queue-heading" title={t.title} more={{ href: "/orders", label: t.all }}>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        {orders.length ? (
          <DataTable caption={t.title} columns={columns} rows={orders} getRowKey={(o) => o.id} getRowHref={(o) => `/orders/${o.id}`} minWidthClassName="min-w-[36rem]" />
        ) : (
          <p className="p-4 text-sm text-ink">{t.empty}</p>
        )}
      </div>
    </DashboardSection>
  );
}

export default OrderQueue;
