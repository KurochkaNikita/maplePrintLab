import type { Metadata } from "next";
import SectionPlaceholder from "@/components/SectionPlaceholder";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.categories.metaTitle };
}

export default async function CategoriesPage() {
  const t = await getDict();
  return (
    <SectionPlaceholder
      title={t.pages.categories.heading}
      description={t.pages.categories.description}
      emptyTitle={t.pages.categories.emptyTitle}
      emptyBody={t.pages.categories.emptyBody}
    />
  );
}
