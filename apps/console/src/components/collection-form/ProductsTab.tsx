"use client";

import { useT } from "@/components/LocaleProvider";
import ProductsTable from "@/components/products-list/ProductsTable";
import { useCollectionFormContext } from "@/hooks/useCollectionFormContext";

/** Read-only list of the products in this collection, each linking to its edit page. */
export function ProductsTab() {
  const t = useT().pages.collections.form.productsTab;
  const labels = useT().pages.products.list;
  const { products, siteUrl } = useCollectionFormContext();

  if (products.length === 0) {
    return <p className="rounded-lg border border-line bg-white px-4 py-3 text-sm text-charcoal">{t.empty}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink">{t.hint}</p>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <ProductsTable products={products} labels={labels} siteUrl={siteUrl} />
      </div>
    </div>
  );
}

export default ProductsTab;
