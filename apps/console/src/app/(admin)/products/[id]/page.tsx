import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createDb, findProduct, listCategoryOptions, listCollectionOptions } from "@maple-print-lab/db";
import { getDict, getLocale } from "@/lib/i18n/server";
import { siteUrl } from "@/lib/site-url";
import EditProductScreen from "@/screens/products/EditProductScreen";

type Params = { params: Promise<{ id: string }> };

// The metadata and the page both need the product; fetch it once per request.
const loadProduct = cache(async (rawId: string) => {
  if (!/^\d+$/.test(rawId)) return null;
  const id = Number(rawId);
  return Number.isSafeInteger(id) ? findProduct(createDb(), id) : null;
});

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const [t, product] = await Promise.all([getDict(), params.then(({ id }) => loadProduct(id))]);
  return { title: product?.translations.en?.title ?? t.pages.products.edit.metaTitle };
}

export default async function EditProductPage({
  params,
  searchParams,
}: Params & { searchParams: Promise<{ created?: string }> }) {
  const db = createDb();
  const { id } = await params;
  // One round of parallel queries: the product and everything else the screen needs.
  const [product, query, t, locale, categories, collections] = await Promise.all([
    loadProduct(id),
    searchParams,
    getDict(),
    getLocale(),
    listCategoryOptions(db),
    listCollectionOptions(db),
  ]);
  if (!product) notFound();

  return (
    <EditProductScreen
      t={t}
      locale={locale}
      product={product}
      categories={categories}
      collections={collections}
      justCreated={query.created === "1"}
      siteUrl={siteUrl}
    />
  );
}
