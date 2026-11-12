import type { CollectionRecord, ProductListItem } from "@maple-print-lab/db";
import BackLink from "@/components/BackLink";
import CollectionForm from "@/components/collection-form/CollectionForm";
import DeleteCollection from "@/components/collection-form/DeleteCollection";
import PageHeader from "@/components/PageHeader";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import { toFormValues } from "@/lib/collections/form-values";

export interface EditCollectionScreenProps {
  t: Dictionary;
  locale: Locale;
  collection: CollectionRecord;
  /** Products in this collection, for the Products tab and the delete dialog. */
  products: ProductListItem[];
  /** Origin of the public site, for thumbnails of photos imported from it. */
  siteUrl?: string;
  /** The page was reached right after creating the collection. */
  justCreated: boolean;
}

export function EditCollectionScreen({ t, locale, collection, products, siteUrl, justCreated }: EditCollectionScreenProps) {
  const p = t.pages.collections;
  const title = collection.translations.en?.title ?? collection.slug;
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
    collection.updatedAt,
  );

  return (
    <div className="space-y-6">
      <BackLink href="/collections">{p.backToList}</BackLink>

      <PageHeader
        title={title}
        description={format(p.edit.description, { date: updated })}
        actions={<DeleteCollection collectionId={collection.slug} title={title} productCount={products.length} />}
      />

      <CollectionForm
        mode="edit"
        collectionId={collection.slug}
        initialValues={toFormValues(collection)}
        products={products}
        siteUrl={siteUrl}
        justCreated={justCreated}
      />
    </div>
  );
}

export default EditCollectionScreen;
