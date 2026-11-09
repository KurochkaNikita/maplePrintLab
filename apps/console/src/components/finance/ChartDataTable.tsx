import type { FinanceSeriesPoint, Granularity } from "@maple-print-lab/db";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import { formatBucket, formatMoney } from "@/lib/finance/format";
import type { Locale } from "@/lib/i18n";

export interface ChartDataTableLabels {
  summary: string;
  bucket: string;
  income: string;
  spent: string;
  profit: string;
}

export interface ChartDataTableProps {
  points: FinanceSeriesPoint[];
  granularity: Granularity;
  locale: Locale;
  labels: ChartDataTableLabels;
}

type Row = { bucket: string; income: number; spent: number; profit: number };

/** The numbers behind the chart, collapsed by default. */
export function ChartDataTable({ points, granularity, locale, labels }: ChartDataTableProps) {
  const rows: Row[] = points.map((p) => ({
    bucket: p.bucket,
    income: p.income,
    spent: p.itemCost + p.expenses,
    profit: p.income - p.itemCost - p.expenses,
  }));
  const numeric = "text-right tabular-nums";
  const money = (get: (row: Row) => number) => (row: Row) => formatMoney(get(row), locale);

  const columns: DataTableColumn<Row>[] = [
    { id: "bucket", header: labels.bucket, rowHeader: true, cell: (r) => formatBucket(r.bucket, granularity, locale) },
    { id: "income", header: labels.income, className: numeric, headerClassName: "text-right", cell: money((r) => r.income) },
    { id: "spent", header: labels.spent, className: numeric, headerClassName: "text-right", cell: money((r) => r.spent) },
    { id: "profit", header: labels.profit, className: numeric, headerClassName: "text-right", cell: money((r) => r.profit) },
  ];

  return (
    <details className="mt-4 rounded-lg border border-line">
      <summary className="flex min-h-11 cursor-pointer items-center px-4 text-sm font-medium text-charcoal">{labels.summary}</summary>
      <DataTable caption={labels.summary} columns={columns} rows={rows} getRowKey={(r) => r.bucket} minWidthClassName="min-w-[28rem]" />
    </details>
  );
}

export default ChartDataTable;
