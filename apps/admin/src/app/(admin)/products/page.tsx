import type { Metadata } from "next";
import SectionPlaceholder from "@/components/SectionPlaceholder";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: t.pages.products.metaTitle,
};

export default function ProductsPage() {
  return (
    <SectionPlaceholder
      title={t.pages.products.heading}
      description={t.pages.products.description}
      emptyTitle={t.pages.products.emptyTitle}
      emptyBody={t.pages.products.emptyBody}
    />
  );
}
