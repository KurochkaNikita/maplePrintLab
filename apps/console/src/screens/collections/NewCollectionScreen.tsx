import BackLink from "@/components/BackLink";
import CollectionForm from "@/components/collection-form/CollectionForm";
import PageHeader from "@/components/PageHeader";
import type { Dictionary } from "@/lib/i18n";
import { emptyCollectionValues } from "@/lib/collections/form-values";

export interface NewCollectionScreenProps {
  t: Dictionary;
  /** Next free position among the collections, prefilled in the form. */
  sortOrder: number;
}

export function NewCollectionScreen({ t, sortOrder }: NewCollectionScreenProps) {
  const p = t.pages.collections;

  return (
    <div className="space-y-6">
      <BackLink href="/collections">{p.backToList}</BackLink>
      <PageHeader title={p.new.heading} description={p.new.description} />
      <CollectionForm mode="create" initialValues={emptyCollectionValues(sortOrder)} />
    </div>
  );
}

export default NewCollectionScreen;
