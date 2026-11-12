import type { CollectionListItem } from "@maple-print-lab/db";
import ButtonLink from "@/components/ButtonLink";
import CollectionsTable from "@/components/collections-list/CollectionsTable";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import type { Dictionary } from "@/lib/i18n";

export interface CollectionsScreenProps {
  t: Dictionary;
  /** Every collection, in storefront order. */
  collections: CollectionListItem[];
}

export function CollectionsScreen({ t, collections }: CollectionsScreenProps) {
  const p = t.pages.collections;

  return (
    <div className="space-y-8">
      <PageHeader
        title={p.heading}
        description={p.description}
        actions={<ButtonLink href="/collections/new">{p.list.newButton}</ButtonLink>}
      />

      {collections.length === 0 ? (
        <EmptyState title={p.list.emptyTitle} body={p.list.emptyBody} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <CollectionsTable collections={collections} labels={p.list} />
        </div>
      )}
    </div>
  );
}

export default CollectionsScreen;
