import { notFound } from "next/navigation";
import type { Dictionary } from "@/lib/dictionaries/en";

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** BCP-47 tags for <html lang>, og:locale, hreflang */
export const localeTag: Record<Locale, string> = {
  en: "en-CA",
  fr: "fr-CA",
};

/** Short endonymic labels for the language switcher (not translated). */
export const localeLabel: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Unwraps the route's `params` promise and validates `lang`, 404-ing if it's not a known locale. */
export async function resolveLocale(
  params: Promise<{ lang: string }>,
): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/lib/dictionaries/en").then((m) => m.default),
  fr: () => import("@/lib/dictionaries/fr").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}

/** Page paths without the locale prefix — shared by nav and sitemap. */
export const routes = ["", "work", "contact"] as const;

/** Absolute path for a locale: localeHref("en", "work") -> "/en/work/" */
export function localeHref(locale: Locale, route: (typeof routes)[number]): string {
  return route ? `/${locale}/${route}/` : `/${locale}/`;
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
