import type { Metadata } from "next";
import { createDb, nextCategorySortOrder } from "@maple-print-lab/db";
import { getDict } from "@/lib/i18n/server";
import NewCategoryScreen from "@/screens/categories/NewCategoryScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.categories.new.metaTitle };
}

export default async function NewCategoryPage() {
  const [t, sortOrder] = await Promise.all([getDict(), nextCategorySortOrder(createDb())]);

  return <NewCategoryScreen t={t} sortOrder={sortOrder} />;
}
