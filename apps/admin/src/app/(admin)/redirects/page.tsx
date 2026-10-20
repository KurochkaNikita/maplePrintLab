import type { Metadata } from "next";
import SectionPlaceholder from "@/components/SectionPlaceholder";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.redirects.metaTitle };
}

export default async function RedirectsPage() {
  const t = await getDict();
  return (
    <SectionPlaceholder
      title={t.pages.redirects.heading}
      description={t.pages.redirects.description}
      emptyTitle={t.pages.redirects.emptyTitle}
      emptyBody={t.pages.redirects.emptyBody}
    />
  );
}
