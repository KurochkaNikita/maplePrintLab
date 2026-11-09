import type { FinanceSummary } from "@maple-print-lab/db";
import BreakdownCard from "@/components/finance/BreakdownCard";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import { formatMoney } from "@/lib/finance/format";
import type { Dictionary, Locale } from "@/lib/i18n";

export interface FinanceBreakdownsProps {
  t: Dictionary["pages"]["finance"]["breakdown"];
  locale: Locale;
  summary: FinanceSummary;
}

const numeric = "text-right tabular-nums";
const numericHeader = "text-right";

/** Where the money comes from (channels, best sellers) and where it goes (expense categories). */
export function FinanceBreakdowns({ t, locale, summary }: FinanceBreakdownsProps) {
  const money = (amount: number) => formatMoney(amount, locale);

  const channelColumns: DataTableColumn<FinanceSummary["byChannel"][number]>[] = [
    { id: "name", header: t.channels, rowHeader: true, cell: (r) => r.name },
    { id: "income", header: t.channelIncome, className: numeric, headerClassName: numericHeader, cell: (r) => money(r.income) },
    { id: "profit", header: t.channelProfit, className: numeric, headerClassName: numericHeader, cell: (r) => money(r.profit) },
  ];
  const itemColumns: DataTableColumn<FinanceSummary["topItems"][number]>[] = [
    { id: "name", header: t.itemName, rowHeader: true, cell: (r) => r.description },
    { id: "qty", header: t.itemQuantity, className: numeric, headerClassName: numericHeader, cell: (r) => r.quantity },
    { id: "income", header: t.channelIncome, className: numeric, headerClassName: numericHeader, cell: (r) => money(r.income) },
    { id: "profit", header: t.channelProfit, className: numeric, headerClassName: numericHeader, cell: (r) => money(r.profit) },
  ];
  const categoryColumns: DataTableColumn<FinanceSummary["expensesByCategory"][number]>[] = [
    { id: "name", header: t.expenses, rowHeader: true, cell: (r) => r.name },
    { id: "amount", header: t.amount, className: numeric, headerClassName: numericHeader, cell: (r) => money(r.amount) },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BreakdownCard title={t.channels} emptyText={t.none} isEmpty={summary.byChannel.length === 0}>
        <DataTable caption={t.channels} columns={channelColumns} rows={summary.byChannel} getRowKey={(r) => r.name} minWidthClassName="min-w-[18rem]" />
      </BreakdownCard>
      <BreakdownCard title={t.expenses} emptyText={t.none} isEmpty={summary.expensesByCategory.length === 0}>
        <DataTable caption={t.expenses} columns={categoryColumns} rows={summary.expensesByCategory} getRowKey={(r) => r.name} minWidthClassName="min-w-[18rem]" />
      </BreakdownCard>
      <div className="lg:col-span-2">
        <BreakdownCard title={t.topItems} emptyText={t.none} isEmpty={summary.topItems.length === 0}>
          <DataTable caption={t.topItems} columns={itemColumns} rows={summary.topItems} getRowKey={(r) => r.description} minWidthClassName="min-w-[28rem]" />
        </BreakdownCard>
      </div>
    </div>
  );
}

export default FinanceBreakdowns;
