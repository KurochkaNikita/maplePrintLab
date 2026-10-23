import type { Metadata } from "next";
import SectionPlaceholder from "@/components/SectionPlaceholder";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.products.metaTitle };
}

export default async function ProductsPage() {
  const t = await getDict();
  return (
    <SectionPlaceholder
      title={t.pages.products.heading}
      description={t.pages.products.description}
      emptyTitle={t.pages.products.emptyTitle}
      emptyBody={t.pages.products.emptyBody}
    />
  );
}
