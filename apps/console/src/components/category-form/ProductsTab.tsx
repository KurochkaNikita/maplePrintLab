"use client";

import { useT } from "@/components/LocaleProvider";
import ProductsTable from "@/components/products-list/ProductsTable";
import { useCategoryFormContext } from "@/hooks/useCategoryFormContext";

/** Read-only list of the products in this category, each linking to its edit page. */
export function ProductsTab() {
  const t = useT().pages.categories.form.productsTab;
  const labels = useT().pages.products.list;
  const { products, siteUrl } = useCategoryFormContext();

  if (products.length === 0) {
    return <p className="rounded-lg border border-line bg-white px-4 py-3 text-sm text-charcoal">{t.empty}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink">{t.hint}</p>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <ProductsTable products={products} labels={labels} siteUrl={siteUrl} hideCategory />
      </div>
    </div>
  );
}

export default ProductsTab;
