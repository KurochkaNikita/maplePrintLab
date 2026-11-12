import type { Metadata } from "next";
import { createDb, listCollections } from "@maple-print-lab/db";
import { getDict } from "@/lib/i18n/server";
import CollectionsScreen from "@/screens/collections/CollectionsScreen";

// The catalogue has a handful of collections, so the list is one page without search.
const LIST_LIMIT = 200;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.collections.metaTitle };
}

export default async function CollectionsPage() {
  const [t, list] = await Promise.all([getDict(), listCollections(createDb(), { pageSize: LIST_LIMIT })]);

  return <CollectionsScreen t={t} collections={list.items} />;
}
