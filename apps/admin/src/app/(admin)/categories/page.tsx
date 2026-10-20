import type { Metadata } from "next";
import SectionPlaceholder from "@/components/SectionPlaceholder";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: t.pages.categories.metaTitle,
};

export default function CategoriesPage() {
  return (
    <SectionPlaceholder
      title={t.pages.categories.heading}
      description={t.pages.categories.description}
      emptyTitle={t.pages.categories.emptyTitle}
      emptyBody={t.pages.categories.emptyBody}
    />
  );
}
