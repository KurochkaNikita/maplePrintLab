import type { PopularItem } from "@maple-print-lab/db";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import DashboardSection from "@/components/dashboard/DashboardSection";
import type { Dictionary } from "@/lib/i18n";

export interface PopularItemsProps {
  t: Dictionary["pages"]["dashboard"]["popular"];
  items: PopularItem[];
}

/** The items ordered most in the last 30 days: what is worth printing ahead. */
export function PopularItems({ t, items }: PopularItemsProps) {
  const columns: DataTableColumn<PopularItem>[] = [
    { id: "name", header: t.name, rowHeader: true, className: "py-3", cell: (i) => i.description },
    { id: "quantity", header: t.quantity, className: "text-right tabular-nums", headerClassName: "text-right", cell: (i) => i.quantity },
  ];

  return (
    <DashboardSection id="popular-heading" title={t.title}>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        {items.length ? (
          <DataTable caption={t.title} columns={columns} rows={items} getRowKey={(i) => i.description} minWidthClassName="min-w-0" />
        ) : (
          <p className="p-4 text-sm text-ink">{t.empty}</p>
        )}
      </div>
    </DashboardSection>
  );
}

export default PopularItems;
