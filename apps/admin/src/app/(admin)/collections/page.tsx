import type { Metadata } from "next";
import SectionPlaceholder from "@/components/SectionPlaceholder";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.collections.metaTitle };
}

export default async function CollectionsPage() {
  const t = await getDict();
  return (
    <SectionPlaceholder
      title={t.pages.collections.heading}
      description={t.pages.collections.description}
      emptyTitle={t.pages.collections.emptyTitle}
      emptyBody={t.pages.collections.emptyBody}
    />
  );
}
