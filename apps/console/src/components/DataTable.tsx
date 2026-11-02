import type { ReactNode } from "react";
import Link from "next/link";

export interface DataTableColumn<T> {
  id: string;
  /** Header text; also the accessible name of the column. */
  header: string;
  /** Keep the header for screen readers but do not show it (e.g. a photo column). */
  hideHeader?: boolean;
  /** Content of the cell for one row. */
  cell: (row: T) => ReactNode;
  /** The row's main cell: becomes `<th scope="row">` and, with `getRowHref`, holds the link that covers the row. */
  rowHeader?: boolean;
  /** Extra classes for this column's `<td>`/`<th>` (e.g. `font-mono`, `whitespace-nowrap`). */
  className?: string;
  /** Extra classes for the header cell (e.g. a width). */
  headerClassName?: string;
}

export interface DataTableProps<T> {
  /** Accessible name of the table and of its scrollable region. */
  caption: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  /** Makes every row clickable: the row-header cell becomes a link to this URL. */
  getRowHref?: (row: T) => string;
  /** Below this width the table scrolls sideways instead of squeezing. */
  minWidthClassName?: string;
}

/** A table built from column definitions. Server component: cell renderers are plain functions. */
export function DataTable<T>({
  caption,
  columns,
  rows,
  getRowKey,
  getRowHref,
  minWidthClassName = "min-w-[44rem]",
}: DataTableProps<T>) {
  return (
    // Focusable so keyboard users can scroll the table sideways on narrow screens.
    <div role="region" aria-label={caption} tabIndex={0} className="overflow-x-auto">
      <table className={`w-full text-left text-sm ${minWidthClassName}`}>
        <caption className="visually-hidden">{caption}</caption>
        <thead className="border-b border-line bg-filament text-charcoal">
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col" className={`px-4 py-3 font-semibold ${column.headerClassName ?? ""}`.trim()}>
                {column.hideHeader ? <span className="visually-hidden">{column.header}</span> : column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-ink">
          {rows.map((row) => (
            // `relative` anchors the stretched link of the row-header cell.
            <tr
              key={getRowKey(row)}
              className="relative transition-colors focus-within:bg-filament/70 hover:bg-filament/70"
            >
              {columns.map((column) =>
                column.rowHeader ? (
                  <th key={column.id} scope="row" className={`px-4 py-1 font-medium ${column.className ?? ""}`.trim()}>
                    {getRowHref ? (
                      <Link
                        href={getRowHref(row)}
                        className="inline-flex min-h-11 items-center font-semibold text-charcoal underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:text-amber-deep hover:underline"
                      >
                        {column.cell(row)}
                      </Link>
                    ) : (
                      column.cell(row)
                    )}
                  </th>
                ) : (
                  <td key={column.id} className={`px-4 py-3 ${column.className ?? ""}`.trim()}>
                    {column.cell(row)}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
