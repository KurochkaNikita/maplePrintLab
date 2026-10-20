import type { Metadata } from "next";
import LangShell from "@/components/LangShell";
import NotFoundView from "@/components/NotFoundView";
import { defaultLocale, getDictionary, locales, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";

export const metadata: Metadata = {
  title: "Page not found — Maple Print Lab",
  robots: { index: false, follow: true },
};

/**
 * Static export: this becomes `out/404.html`, served for every unknown URL
 * whatever its language. The server HTML is English; `NotFoundView` switches
 * to the visitor's language on the client, using the same dictionaries.
 */
export default async function NotFound() {
  const entries = await Promise.all(locales.map(async (l) => [l, await getDictionary(l)] as const));
  const dicts = Object.fromEntries(entries) as Record<Locale, Dictionary>;

  return (
    <LangShell lang={defaultLocale} bare>
      <NotFoundView dicts={dicts} />
    </LangShell>
  );
}
