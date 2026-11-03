import type { CategoryListItem } from "@maple-print-lab/db";
import ButtonLink from "@/components/ButtonLink";
import CategoriesTable from "@/components/categories-list/CategoriesTable";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import type { Dictionary } from "@/lib/i18n";

export interface CategoriesScreenProps {
  t: Dictionary;
  /** Every category, in storefront order. */
  categories: CategoryListItem[];
}

export function CategoriesScreen({ t, categories }: CategoriesScreenProps) {
  const p = t.pages.categories;

  return (
    <div className="space-y-8">
      <PageHeader
        title={p.heading}
        description={p.description}
        actions={<ButtonLink href="/categories/new">{p.list.newButton}</ButtonLink>}
      />

      {categories.length === 0 ? (
        <EmptyState title={p.list.emptyTitle} body={p.list.emptyBody} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <CategoriesTable categories={categories} labels={p.list} />
        </div>
      )}
    </div>
  );
}

export default CategoriesScreen;
