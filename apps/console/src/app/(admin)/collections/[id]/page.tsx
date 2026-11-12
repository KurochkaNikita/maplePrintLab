import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createDb, findCollection, listProducts } from "@maple-print-lab/db";
import { getDict, getLocale } from "@/lib/i18n/server";
import { siteUrl } from "@/lib/site-url";
import EditCollectionScreen from "@/screens/collections/EditCollectionScreen";

type Params = { params: Promise<{ id: string }> };

// The metadata and the page both need the collection; fetch it once per request.
const loadCollection = cache((id: string) => findCollection(createDb(), id));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const [t, collection] = await Promise.all([getDict(), params.then(({ id }) => loadCollection(id))]);
  return { title: collection?.translations.en?.title ?? t.pages.collections.edit.metaTitle };
}

export default async function EditCollectionPage({
  params,
  searchParams,
}: Params & { searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  const [collection, query, t, locale] = await Promise.all([loadCollection(id), searchParams, getDict(), getLocale()]);
  if (!collection) notFound();

  // A collection holds a handful of products, so one large page lists them all.
  const { items: products } = await listProducts(createDb(), { collectionId: collection.slug, pageSize: 500 });

  return (
    <EditCollectionScreen
      t={t}
      locale={locale}
      collection={collection}
      products={products}
      siteUrl={siteUrl}
      justCreated={query.created === "1"}
    />
  );
}
