import type { ProductListItem } from "@maple-print-lab/db";
import ButtonLink from "@/components/ButtonLink";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import ProductsNoResults from "@/components/products-list/ProductsNoResults";
import ProductsPagination from "@/components/products-list/ProductsPagination";
import ProductsSearch from "@/components/ProductsSearch";
import ProductsTable from "@/components/products-list/ProductsTable";
import type { Dictionary } from "@/lib/i18n";

export interface ProductsScreenProps {
  t: Dictionary;
  /** The current page of the (filtered) catalogue. */
  products: ProductListItem[];
  /** Number of products matching the search, across all pages. */
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  /** The applied search text, empty when none. */
  query: string;
  /** Origin of the public site, for thumbnails of photos imported from it. */
  siteUrl?: string;
}

export function ProductsScreen({
  t,
  products,
  total,
  page,
  pageCount,
  pageSize,
  query,
  siteUrl,
}: ProductsScreenProps) {
  const p = t.pages.products;

  return (
    <div className="space-y-8">
      <PageHeader
        title={p.heading}
        description={p.description}
        actions={<ButtonLink href="/products/new">{p.list.newButton}</ButtonLink>}
      />

      {total === 0 && !query ? (
        <EmptyState title={p.list.emptyTitle} body={p.list.emptyBody} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="border-b border-line p-3 sm:p-4">
            <ProductsSearch initialQuery={query} label={p.list.search.label} clearLabel={p.list.search.clear} />
          </div>

          {products.length === 0 ? (
            <ProductsNoResults labels={p.list.search} query={query} />
          ) : (
            <>
              <ProductsTable products={products} labels={p.list} siteUrl={siteUrl} />
              <ProductsPagination
                labels={p.list.pagination}
                query={query}
                page={page}
                pageCount={pageCount}
                pageSize={pageSize}
                total={total}
                count={products.length}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductsScreen;
