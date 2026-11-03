import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createDb, findCategory, listProducts } from "@maple-print-lab/db";
import { getDict, getLocale } from "@/lib/i18n/server";
import { siteUrl } from "@/lib/site-url";
import EditCategoryScreen from "@/screens/categories/EditCategoryScreen";

type Params = { params: Promise<{ id: string }> };

// The metadata and the page both need the category; fetch it once per request.
const loadCategory = cache((id: string) => findCategory(createDb(), id));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const [t, category] = await Promise.all([getDict(), params.then(({ id }) => loadCategory(id))]);
  return { title: category?.translations.en?.title ?? t.pages.categories.edit.metaTitle };
}

export default async function EditCategoryPage({
  params,
  searchParams,
}: Params & { searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  const [category, query, t, locale] = await Promise.all([loadCategory(id), searchParams, getDict(), getLocale()]);
  if (!category) notFound();

  // A category holds a handful of products, so one large page lists them all.
  const { items: products, total: productCount } = await listProducts(createDb(), {
    categoryId: category.slug,
    pageSize: 500,
  });

  return (
    <EditCategoryScreen
      t={t}
      locale={locale}
      category={category}
      productCount={productCount}
      products={products}
      siteUrl={siteUrl}
      justCreated={query.created === "1"}
    />
  );
}
