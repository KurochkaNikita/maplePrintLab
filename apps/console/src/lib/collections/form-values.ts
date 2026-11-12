import type { CollectionRecord, CollectionTextInput } from "@maple-print-lab/db";
import { PRODUCT_LOCALES, type CollectionFormValues, type CollectionTextValues, type ProductLocale } from "./types";

const emptyText = (): CollectionTextValues => ({ title: "", intro: "", seoTitle: "", seoDescription: "" });

const toTextValues = (tr: CollectionTextInput | undefined): CollectionTextValues => (tr ? { ...tr } : emptyText());

export function emptyCollectionValues(sortOrder: number): CollectionFormValues {
  return {
    slug: "",
    published: true,
    sortOrder: String(sortOrder),
    translations: Object.fromEntries(PRODUCT_LOCALES.map((l) => [l, emptyText()])) as Record<
      ProductLocale,
      CollectionTextValues
    >,
  };
}

export function toFormValues(collection: CollectionRecord): CollectionFormValues {
  return {
    slug: collection.slug,
    published: collection.published,
    sortOrder: String(collection.sortOrder),
    translations: Object.fromEntries(
      PRODUCT_LOCALES.map((l) => [l, toTextValues(collection.translations[l])]),
    ) as Record<ProductLocale, CollectionTextValues>,
  };
}
