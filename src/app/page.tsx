import type { Metadata } from "next";
import LangShell from "@/components/LangShell";
import { defaultLocale, getDictionary } from "@/lib/i18n";
import { rootMetadata } from "@/lib/metadata";
import HomePage from "./[lang]/page";

/**
 * "/" serves the default locale's (English) homepage directly — no redirect.
 * Its canonical points at "/en/" (see rootMetadata), so it isn't indexed as
 * duplicate content.
 */
export async function generateMetadata(): Promise<Metadata> {
  return rootMetadata(defaultLocale, await getDictionary(defaultLocale));
}

export default function RootPage() {
  return (
    <LangShell lang={defaultLocale}>
      <HomePage params={Promise.resolve({ lang: defaultLocale })} />
    </LangShell>
  );
}
