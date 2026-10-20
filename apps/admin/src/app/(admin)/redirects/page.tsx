import type { Metadata } from "next";
import SectionPlaceholder from "@/components/SectionPlaceholder";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: t.pages.redirects.metaTitle,
};

export default function RedirectsPage() {
  return (
    <SectionPlaceholder
      title={t.pages.redirects.heading}
      description={t.pages.redirects.description}
      emptyTitle={t.pages.redirects.emptyTitle}
      emptyBody={t.pages.redirects.emptyBody}
    />
  );
}
