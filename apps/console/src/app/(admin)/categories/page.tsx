import type { Metadata } from "next";
import { createDb, listCategories } from "@maple-print-lab/db";
import { getDict } from "@/lib/i18n/server";
import CategoriesScreen from "@/screens/categories/CategoriesScreen";

// The catalogue has a handful of categories, so the list is one page without search.
const LIST_LIMIT = 200;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.categories.metaTitle };
}

export default async function CategoriesPage() {
  const [t, list] = await Promise.all([getDict(), listCategories(createDb(), { pageSize: LIST_LIMIT })]);

  return <CategoriesScreen t={t} categories={list.items} />;
}
