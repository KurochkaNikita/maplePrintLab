import type { OrderRequestRecord } from "@maple-print-lab/db";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import ListPagination from "@/components/ListPagination";
import PageHeader from "@/components/PageHeader";
import RequestStatusBadge from "@/components/requests/RequestStatusBadge";
import RequestStatusFilter from "@/components/requests/RequestStatusFilter";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import { ORDER_REQUEST_STATUSES, requestsHref, type OrderRequestStatus } from "@/lib/order-requests/params";

export interface RequestsScreenProps {
  t: Dictionary;
  locale: Locale;
  requests: OrderRequestRecord[];
  /** Requests per status, for the filter. */
  counts: Record<OrderRequestStatus, number>;
  /** Current filter; undefined shows all. */
  status?: OrderRequestStatus;
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

const INTL_LOCALE: Record<Locale, string> = { ru: "ru-CA", en: "en-CA", fr: "fr-CA" };

export function RequestsScreen({ t, locale, requests, counts, status, total, page, pageCount, pageSize }: RequestsScreenProps) {
  const p = t.pages.requests;
  const dateFormat = new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "medium", timeStyle: "short", timeZone: "America/Vancouver" });
  const all = ORDER_REQUEST_STATUSES.reduce((sum, s) => sum + counts[s], 0);

  const filterItems = [
    { key: "all", label: p.list.filter.all, href: requestsHref(undefined), count: all, active: !status },
    ...ORDER_REQUEST_STATUSES.map((s) => ({ key: s, label: p.status[s], href: requestsHref(s), count: counts[s], active: status === s })),
  ];

  const columns: DataTableColumn<OrderRequestRecord>[] = [
    { id: "date", header: p.list.columns.date, rowHeader: true, className: "whitespace-nowrap", cell: (r) => dateFormat.format(r.createdAt) },
    { id: "name", header: p.list.columns.name, cell: (r) => `${r.firstName} ${r.lastName}` },
    { id: "email", header: p.list.columns.email, className: "break-all", cell: (r) => r.email },
    {
      id: "product",
      header: p.list.columns.product,
      cell: (r) => (r.items.length > 1 ? `${r.items[0].productTitle} ${format(p.list.andMore, { count: r.items.length - 1 })}` : r.items[0]?.productTitle),
    },
    { id: "status", header: p.list.columns.status, cell: (r) => <RequestStatusBadge status={r.status} label={p.status[r.status]} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={p.heading} description={p.description} />
      <RequestStatusFilter label={p.list.filter.label} items={filterItems} />

      {total === 0 ? (
        status ? (
          <EmptyState title={p.list.emptyFilteredTitle} body={p.list.emptyFilteredBody} />
        ) : (
          <EmptyState title={p.list.emptyTitle} body={p.list.emptyBody} />
        )
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <DataTable caption={p.list.tableLabel} columns={columns} rows={requests} getRowKey={(r) => r.id} getRowHref={(r) => `/requests/${r.id}`} minWidthClassName="min-w-[44rem]" />
          <ListPagination labels={p.list.pagination} getHref={(n) => requestsHref(status, n)} page={page} pageCount={pageCount} pageSize={pageSize} total={total} count={requests.length} />
        </div>
      )}
    </div>
  );
}

export default RequestsScreen;
