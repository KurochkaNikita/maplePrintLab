import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  createDb,
  findProduct,
  getProductSales,
  listCategoryOptions,
  listCollectionOptions,
} from "@maple-print-lab/db";
import { getDict, getLocale } from "@/lib/i18n/server";
import { siteUrl } from "@/lib/site-url";
import ProductScreen from "@/screens/products/ProductScreen";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type Params = { params: Promise<{ id: string }> };

const parseId = (rawId: string): number | null => {
  const id = /^\d+$/.test(rawId) ? Number(rawId) : NaN;
  return Number.isSafeInteger(id) ? id : null;
};

// The metadata and the page both need the product; fetch it once per request.
const loadProduct = cache(async (rawId: string) => {
  const id = parseId(rawId);
  return id === null ? null : findProduct(createDb(), id);
});

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const [t, product] = await Promise.all([getDict(), params.then(({ id }) => loadProduct(id))]);
  return { title: product?.translations.en?.title ?? t.pages.products.view.metaTitle };
}

export default async function ProductPage({
  params,
  searchParams,
}: Params & { searchParams: Promise<{ created?: string; page?: string }> }) {
  const db = createDb();
  const [{ id: rawId }, query] = await Promise.all([params, searchParams]);
  const id = parseId(rawId);
  if (id === null) notFound();

  // One round of parallel queries: the product, its sales and everything else the screen needs.
  const [product, sales, t, locale, categories, collections] = await Promise.all([
    loadProduct(rawId),
    getProductSales(db, id, { page: Number(query.page), pageSize: PAGE_SIZE }),
    getDict(),
    getLocale(),
    listCategoryOptions(db),
    listCollectionOptions(db),
  ]);
  if (!product) notFound();

  return (
    <ProductScreen
      t={t}
      locale={locale}
      product={product}
      categoryTitle={categories.find((c) => c.id === product.categoryId)?.title ?? null}
      collectionTitles={product.collectionIds.map((cid) => collections.find((c) => c.id === cid)?.title ?? cid)}
      sales={sales}
      pageSize={PAGE_SIZE}
      justCreated={query.created === "1"}
      siteUrl={siteUrl}
    />
  );
}
