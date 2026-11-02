import type { CategoryOption, CollectionOption } from "@maple-print-lab/db";
import BackLink from "@/components/BackLink";
import PageHeader from "@/components/PageHeader";
import ProductForm from "@/components/product-form/ProductForm";
import type { Dictionary } from "@/lib/i18n";
import { emptyProductValues } from "@/lib/products/form-values";

export interface NewProductScreenProps {
  t: Dictionary;
  categories: CategoryOption[];
  collections: CollectionOption[];
  /** Next free position in the catalogue, prefilled in the form. */
  sortOrder: number;
}

export function NewProductScreen({ t, categories, collections, sortOrder }: NewProductScreenProps) {
  const p = t.pages.products;

  return (
    <div className="space-y-6">
      <BackLink href="/products">{p.backToList}</BackLink>

      <PageHeader title={p.new.heading} description={p.new.description} />

      <ProductForm
        mode="create"
        initialValues={emptyProductValues(sortOrder)}
        categories={categories}
        collections={collections}
      />
    </div>
  );
}

export default NewProductScreen;
