import type { ExpenseListItem } from "@maple-print-lab/db";
import ButtonLink from "@/components/ButtonLink";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import ListPagination from "@/components/ListPagination";
import PageHeader from "@/components/PageHeader";
import { formatDate, formatMoney } from "@/lib/finance/format";
import type { Dictionary, Locale } from "@/lib/i18n";

export interface ExpensesScreenProps {
  t: Dictionary;
  locale: Locale;
  expenses: ExpenseListItem[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

const getHref = (page: number) => (page > 1 ? `/expenses?page=${page}` : "/expenses");

export function ExpensesScreen({ t, locale, expenses, total, page, pageCount, pageSize }: ExpensesScreenProps) {
  const p = t.pages.expenses;

  const columns: DataTableColumn<ExpenseListItem>[] = [
    { id: "date", header: p.list.columns.date, rowHeader: true, className: "whitespace-nowrap", cell: (e) => formatDate(e.spentOn, locale) },
    { id: "description", header: p.list.columns.description, cell: (e) => e.description },
    { id: "category", header: p.list.columns.category, cell: (e) => e.categoryName },
    { id: "amount", header: p.list.columns.amount, className: "text-right tabular-nums whitespace-nowrap", headerClassName: "text-right", cell: (e) => formatMoney(e.amount, locale) },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title={p.heading} description={p.description} actions={<ButtonLink href="/expenses/new">{p.list.newButton}</ButtonLink>} />

      {total === 0 ? (
        <EmptyState title={p.list.emptyTitle} body={p.list.emptyBody} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <DataTable caption={p.list.tableLabel} columns={columns} rows={expenses} getRowKey={(e) => e.id} getRowHref={(e) => `/expenses/${e.id}`} minWidthClassName="min-w-[36rem]" />
          <ListPagination labels={p.list.pagination} getHref={getHref} page={page} pageCount={pageCount} pageSize={pageSize} total={total} count={expenses.length} />
        </div>
      )}
    </div>
  );
}

export default ExpensesScreen;
