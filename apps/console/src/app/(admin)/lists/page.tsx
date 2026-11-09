import type { Metadata } from "next";
import { createDb, listFinanceOptions } from "@maple-print-lab/db";
import { getDict } from "@/lib/i18n/server";
import ListsScreen from "@/screens/lists/ListsScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.lists.metaTitle };
}

export default async function ListsPage() {
  const db = createDb();
  const [t, channels, categories] = await Promise.all([
    getDict(),
    listFinanceOptions(db, "channel"),
    listFinanceOptions(db, "expense_category"),
  ]);

  return <ListsScreen t={t} channels={channels} categories={categories} />;
}
