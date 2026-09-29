import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
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
export const routes = ["", "products", "contact"] as const;

/** Absolute path for a locale: localeHref("en", "products") -> "/en/products/" */
export function localeHref(locale: Locale, route: (typeof routes)[number]): string {
  return route ? `/${locale}/${route}/` : `/${locale}/`;
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** `/en/product/some-slug/`-style absolute path for a locale + path. */
function localizedPath(lang: Locale, path: string): string {
  return path ? `/${lang}/${path}/` : `/${lang}/`;
}

/** `canonical` + per-locale `languages` for a path shared across locales, e.g. "product/some-slug". */
function localizedAlternates(lang: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localizedPath(lang, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [localeTag[l], localizedPath(l, path)])),
      "x-default": localizedPath(defaultLocale, path),
    },
  };
}

/**
 * Builds `title`/`description`/`alternates`/`openGraph`/`twitter` for a page's
 * `generateMetadata` — pass only what the page adds.
 *
 * `openGraph`/`twitter` aren't deep-merged with the layout's by Next.js, so a
 * page that skips them would show the homepage's title/description/url when
 * shared on social media. They're built here (from the same title/description
 * every page already passes) whenever both are plain strings — the root
 * layout passes a `{ default, template }` title object instead, so it's
 * skipped here and keeps building its own full `openGraph`/`twitter`.
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
}: {
  lang: Locale;
  path: string;
  title?: Metadata["title"];
  description?: Metadata["description"];
}): Metadata {
  const ogTitle = typeof title === "string" ? title : undefined;
  const ogDescription = typeof description === "string" ? description : undefined;

  return {
    // Omit unset keys entirely — Next.js merges layout/page metadata by
    // spreading, so an explicit `title: undefined` would blank out the
    // title template inherited from the layout instead of falling back to it.
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    alternates: localizedAlternates(lang, path),
    ...(ogTitle !== undefined &&
      ogDescription !== undefined && {
        openGraph: {
          type: "website",
          siteName: siteConfig.name,
          title: ogTitle,
          description: ogDescription,
          url: `${siteConfig.url}${localizedPath(lang, path)}`,
          locale: localeTag[lang].replace("-", "_"),
        },
        twitter: {
          card: "summary_large_image",
          title: ogTitle,
          description: ogDescription,
        },
      }),
  };
}
