import type { CategoryListItem } from "@maple-print-lab/db";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import StatusIcon from "@/components/StatusIcon";
import type { Dictionary } from "@/lib/i18n";
import EyeIcon from "@/icons/eye.svg";
import EyeOffIcon from "@/icons/eye-off.svg";

export interface CategoriesTableProps {
  categories: CategoryListItem[];
  labels: Dictionary["pages"]["categories"]["list"];
}

/** The categories list: only says which columns there are; `DataTable` builds the table. */
export function CategoriesTable({ categories, labels }: CategoriesTableProps) {
  // dd.mm.yyyy in every interface language (the ru-RU pattern).
  const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

  const columns: DataTableColumn<CategoryListItem>[] = [
    {
      id: "title",
      header: labels.columns.title,
      rowHeader: true,
      cell: (c) => (
        <>
          {c.title ?? labels.untitled}
          {c.isDefault && (
            <span className="ml-2 rounded-md border border-line bg-filament px-1.5 py-0.5 text-xs font-medium text-charcoal">
              {labels.defaultBadge}
            </span>
          )}
        </>
      ),
    },
    { id: "slug", header: labels.columns.slug, className: "font-mono text-[13px]", cell: (c) => c.id },
    { id: "products", header: labels.columns.products, cell: (c) => c.productCount },
    { id: "order", header: labels.columns.order, cell: (c) => c.sortOrder },
    {
      id: "status",
      header: labels.columns.status,
      cell: (c) =>
        c.published ? (
          <StatusIcon icon={EyeIcon} label={labels.published} className="border-green-700/30 bg-green-50 text-green-700" />
        ) : (
          <StatusIcon icon={EyeOffIcon} label={labels.draft} className="border-gray-300 bg-gray-100 text-gray-600" />
        ),
    },
    {
      id: "updated",
      header: labels.columns.updated,
      className: "whitespace-nowrap",
      cell: (c) => dateFormat.format(c.updatedAt),
    },
  ];

  return (
    <DataTable
      caption={labels.tableLabel}
      columns={columns}
      rows={categories}
      getRowKey={(c) => c.id}
      getRowHref={(c) => `/categories/${c.id}`}
    />
  );
}

export default CategoriesTable;
