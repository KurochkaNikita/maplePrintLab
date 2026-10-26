import type { Metadata } from "next";
import { createDb, listCategoryOptions, listCollectionOptions, nextProductSortOrder } from "@maple-print-lab/db";
import { getDict } from "@/lib/i18n/server";
import NewProductScreen from "@/screens/products/NewProductScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.products.new.metaTitle };
}

export default async function NewProductPage() {
  const db = createDb();
  const [t, categories, collections, sortOrder] = await Promise.all([
    getDict(),
    listCategoryOptions(db),
    listCollectionOptions(db),
    nextProductSortOrder(db),
  ]);

  return <NewProductScreen t={t} categories={categories} collections={collections} sortOrder={sortOrder} />;
}
