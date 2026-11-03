import type { CategoryRecord, ProductListItem } from "@maple-print-lab/db";
import BackLink from "@/components/BackLink";
import CategoryForm from "@/components/category-form/CategoryForm";
import DeleteCategory from "@/components/category-form/DeleteCategory";
import PageHeader from "@/components/PageHeader";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import { toFormValues } from "@/lib/categories/form-values";

export interface EditCategoryScreenProps {
  t: Dictionary;
  locale: Locale;
  category: CategoryRecord;
  /** Products in this category; they move to the fallback category on delete. */
  productCount: number;
  /** Those products, for the Products tab. */
  products: ProductListItem[];
  /** Origin of the public site, for thumbnails of photos imported from it. */
  siteUrl?: string;
  /** The page was reached right after creating the category. */
  justCreated: boolean;
}

export function EditCategoryScreen({ t, locale, category, productCount, products, siteUrl, justCreated }: EditCategoryScreenProps) {
  const p = t.pages.categories;
  const title = category.translations.en?.title ?? category.slug;
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
    category.updatedAt,
  );

  return (
    <div className="space-y-6">
      <BackLink href="/categories">{p.backToList}</BackLink>

      <PageHeader
        title={title}
        description={format(p.edit.description, { date: updated })}
        actions={
          category.isDefault ? undefined : (
            <DeleteCategory categoryId={category.slug} title={title} productCount={productCount} />
          )
        }
      />

      {category.isDefault && (
        <p className="rounded-lg border border-line bg-white px-4 py-3 text-sm text-charcoal">{p.edit.defaultNote}</p>
      )}

      <CategoryForm
        mode="edit"
        categoryId={category.slug}
        initialValues={toFormValues(category)}
        isDefault={category.isDefault}
        products={products}
        siteUrl={siteUrl}
        justCreated={justCreated}
      />
    </div>
  );
}

export default EditCategoryScreen;
