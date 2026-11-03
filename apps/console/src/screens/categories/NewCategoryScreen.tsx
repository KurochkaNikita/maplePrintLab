import BackLink from "@/components/BackLink";
import CategoryForm from "@/components/category-form/CategoryForm";
import PageHeader from "@/components/PageHeader";
import type { Dictionary } from "@/lib/i18n";
import { emptyCategoryValues } from "@/lib/categories/form-values";

export interface NewCategoryScreenProps {
  t: Dictionary;
  /** Next free position among the categories, prefilled in the form. */
  sortOrder: number;
}

export function NewCategoryScreen({ t, sortOrder }: NewCategoryScreenProps) {
  const p = t.pages.categories;

  return (
    <div className="space-y-6">
      <BackLink href="/categories">{p.backToList}</BackLink>
      <PageHeader title={p.new.heading} description={p.new.description} />
      <CategoryForm mode="create" initialValues={emptyCategoryValues(sortOrder)} />
    </div>
  );
}

export default NewCategoryScreen;
