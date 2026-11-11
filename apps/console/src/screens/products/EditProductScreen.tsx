import type { CategoryOption, CollectionOption, ProductRecord } from "@maple-print-lab/db";
import BackLink from "@/components/BackLink";
import PageHeader from "@/components/PageHeader";
import ProductForm from "@/components/product-form/ProductForm";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import { toFormValues } from "@/lib/products/form-values";

export interface EditProductScreenProps {
  t: Dictionary;
  locale: Locale;
  product: ProductRecord;
  categories: CategoryOption[];
  collections: CollectionOption[];
  /** Origin of the public site, for previews of photos imported from it. */
  siteUrl?: string;
}

export function EditProductScreen({
  t,
  locale,
  product,
  categories,
  collections,
  siteUrl,
}: EditProductScreenProps) {
  const p = t.pages.products;
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
    product.updatedAt,
  );

  return (
    <div className="space-y-6">
      <BackLink href={`/products/${product.id}`}>{p.edit.backToProduct}</BackLink>

      <PageHeader
        title={product.translations.en?.title ?? product.slug}
        description={format(p.edit.description, { date: updated })}
      />

      <ProductForm
        mode="edit"
        productId={product.id}
        initialValues={toFormValues(product)}
        categories={categories}
        collections={collections}
        photoBaseUrl={siteUrl ? `${siteUrl}/product/${product.slug}/` : undefined}
      />
    </div>
  );
}

export default EditProductScreen;
