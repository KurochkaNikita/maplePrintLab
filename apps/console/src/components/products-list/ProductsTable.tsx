import type { ProductListItem, ProductSortKey } from "@maple-print-lab/db";
import DataTable, { type DataTableColumn } from "@/components/DataTable";
import ProductThumb from "@/components/ProductThumb";
import { format, type Dictionary } from "@/lib/i18n";
import { nextProductSort, productsListHref, type ProductListSort } from "@/lib/products/list-params";
import { productThumbUrl } from "@/lib/products/thumb-url";
import ProductStatus from "./ProductStatus";

export interface ProductsTableProps {
  products: ProductListItem[];
  labels: Dictionary["pages"]["products"]["list"];
  /** Origin of the public site, for thumbnails of photos imported from it. */
  siteUrl?: string;
  /** Hide the category column, e.g. on a page that already is one category. */
  hideCategory?: boolean;
  /** Turns the title, category and collection headers into sort links; leave out for a table that cannot sort. */
  sortable?: {
    /** The applied search, kept when the sort changes. */
    query: string;
    /** The applied sort, if any. */
    current?: ProductListSort;
  };
}

/** The products list: only says which columns there are; `DataTable` builds the table. */
export function ProductsTable({ products, labels, siteUrl, hideCategory = false, sortable }: ProductsTableProps) {
  const sortOf = (key: ProductSortKey, header: string): DataTableColumn<ProductListItem>["sort"] =>
    sortable && {
      href: productsListHref({ q: sortable.query, sort: nextProductSort(sortable.current, key) }),
      direction: sortable.current?.key === key ? sortable.current.dir : null,
      label: format(labels.sortBy, { column: header }),
    };

  const columns: DataTableColumn<ProductListItem>[] = [
    {
      id: "photo",
      header: labels.columns.photo,
      hideHeader: true,
      headerClassName: "w-24",
      className: "!p-0",
      cell: (p) => <ProductThumb src={productThumbUrl(p.slug, p.imageFile, siteUrl)} />,
    },
    {
      id: "title",
      header: labels.columns.title,
      rowHeader: true,
      sort: sortOf("title", labels.columns.title),
      cell: (p) => p.title ?? labels.untitled,
    },
    ...(hideCategory
      ? []
      : [
          {
            id: "category",
            header: labels.columns.category,
            sort: sortOf("category", labels.columns.category),
            cell: (p: ProductListItem) => p.categoryTitle ?? p.categoryId,
          },
        ]),
    {
      id: "collection",
      header: labels.columns.collection,
      sort: sortOf("collection", labels.columns.collection),
      cell: (p) => (p.collectionTitles.length ? p.collectionTitles.join(", ") : labels.noCollection),
    },
    { id: "status", header: labels.columns.status, cell: (p) => <ProductStatus product={p} labels={labels} /> },
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
