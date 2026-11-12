import type { Metadata } from "next";
import { createDb, nextCollectionSortOrder } from "@maple-print-lab/db";
import { getDict } from "@/lib/i18n/server";
import NewCollectionScreen from "@/screens/collections/NewCollectionScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.collections.new.metaTitle };
}

export default async function NewCollectionPage() {
  const [t, sortOrder] = await Promise.all([getDict(), nextCollectionSortOrder(createDb())]);

  return <NewCollectionScreen t={t} sortOrder={sortOrder} />;
}
