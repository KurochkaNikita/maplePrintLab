import type { ProductListItem } from "@maple-print-lab/db";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import ProductThumb from "@/components/ProductThumb";
import { type Dictionary } from "@/lib/i18n";
import { productThumbUrl } from "@/lib/products/thumb-url";
import ProductStatus from "./ProductStatus";

export interface ProductsTableProps {
  products: ProductListItem[];
  labels: Dictionary["pages"]["products"]["list"];
  /** Origin of the public site, for thumbnails of photos imported from it. */
  siteUrl?: string;
}

/** The products list: only says which columns there are; `DataTable` builds the table. */
export function ProductsTable({ products, labels, siteUrl }: ProductsTableProps) {
  // dd.mm.yyyy in every interface language (the ru-RU pattern).
  const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

  const columns: DataTableColumn<ProductListItem>[] = [
    {
      id: "photo",
      header: labels.columns.photo,
      hideHeader: true,
      headerClassName: "w-20",
      className: "!py-2",
      cell: (p) => <ProductThumb src={productThumbUrl(p.slug, p.imageFile, siteUrl)} />,
    },
    { id: "title", header: labels.columns.title, rowHeader: true, cell: (p) => p.title ?? labels.untitled },
    { id: "slug", header: labels.columns.slug, className: "font-mono text-[13px]", cell: (p) => p.slug },
    { id: "category", header: labels.columns.category, cell: (p) => p.categoryTitle ?? p.categoryId },
    { id: "status", header: labels.columns.status, cell: (p) => <ProductStatus product={p} labels={labels} /> },
    {
      id: "updated",
      header: labels.columns.updated,
      className: "whitespace-nowrap",
      cell: (p) => dateFormat.format(p.updatedAt),
    },
  ];

  return (
    <DataTable
      caption={labels.tableLabel}
      columns={columns}
      rows={products}
      getRowKey={(p) => p.id}
      getRowHref={(p) => `/products/${p.id}`}
    />
  );
}

export default ProductsTable;
