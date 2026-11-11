import type { Metadata } from "next";
import { createDb, listFinanceOptions } from "@maple-print-lab/db";
import { getDict } from "@/lib/i18n/server";
import SettingsScreen from "@/screens/settings/SettingsScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.settings.metaTitle };
}

export default async function ListsPage() {
  const db = createDb();
  const [t, channels, categories] = await Promise.all([
    getDict(),
    listFinanceOptions(db, "channel"),
    listFinanceOptions(db, "expense_category"),
  ]);

  return <SettingsScreen t={t} channels={channels} categories={categories} />;
}
