import type { ProductRecord, ProductSales } from "@maple-print-lab/db";
import EmptyState from "@/components/EmptyState";
import ProductChannelsTable from "@/components/product-view/ProductChannelsTable";
import ProductCreatedToast from "@/components/product-view/ProductCreatedToast";
import ProductInfoCard from "@/components/product-view/ProductInfoCard";
import ProductSalesHistory from "@/components/product-view/ProductSalesHistory";
import ProductSalesTiles from "@/components/product-view/ProductSalesTiles";
import ProductViewHeader from "@/components/product-view/ProductViewHeader";
import type { Dictionary, Locale } from "@/lib/i18n";

export interface ProductScreenProps {
  t: Dictionary;
  locale: Locale;
  product: ProductRecord;
  categoryTitle: string | null;
  collectionTitles: string[];
  sales: ProductSales;
  pageSize: number;
  /** The page was reached right after creating the product. */
  justCreated: boolean;
  /** Origin of the public site, for the "view on site" link and photo previews. */
  siteUrl?: string;
}

/** Read-only product page: details, sales totals, per-channel split and sales history. */
export function ProductScreen({ t, locale, product, categoryTitle, collectionTitles, sales, pageSize, justCreated, siteUrl }: ProductScreenProps) {
  const p = t.pages.products;
  const sold = sales.summary.orders > 0;

  return (
    <div className="space-y-8">
      {justCreated && <ProductCreatedToast productId={product.id} />}
      <ProductViewHeader t={p} product={product} categoryTitle={categoryTitle} siteUrl={siteUrl} />
      <ProductInfoCard t={p.view.info} locale={locale} product={product} collectionTitles={collectionTitles} />

      <section aria-labelledby="product-sales-heading" className="space-y-4">
        <h2 id="product-sales-heading" className="font-display text-lg font-semibold text-charcoal">{p.view.sales.heading}</h2>
        {sold ? (
          <ProductSalesTiles t={p.view.sales} locale={locale} summary={sales.summary} />
        ) : (
          <EmptyState title={p.view.sales.emptyTitle} body={p.view.sales.emptyBody} />
        )}
      </section>

      {sold && (
        <>
          <ProductChannelsTable t={p.view.channels} locale={locale} channels={sales.byChannel} />
          <ProductSalesHistory t={p.view.history} locale={locale} productId={product.id} lines={sales.lines} pageSize={pageSize} />
        </>
      )}
    </div>
  );
}

export default ProductScreen;
