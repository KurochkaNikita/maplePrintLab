import type { Metadata } from "next";
import SectionPlaceholder from "@/components/SectionPlaceholder";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: t.pages.collections.metaTitle,
};

export default function CollectionsPage() {
  return (
    <SectionPlaceholder
      title={t.pages.collections.heading}
      description={t.pages.collections.description}
      emptyTitle={t.pages.collections.emptyTitle}
      emptyBody={t.pages.collections.emptyBody}
    />
  );
}
