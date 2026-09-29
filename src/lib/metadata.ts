import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { defaultLocale, locales, localeTag, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";

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
 * skipped here and keeps building its own full `openGraph`/`twitter` (see
 * `rootMetadata`).
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

/**
 * Full metadata for the root `[lang]` layout: the site-wide fields
 * (`metadataBase`, `keywords`, `applicationName`, `robots`) that never vary
 * per page, plus the homepage's own `title`/`description`/`alternates`/
 * `openGraph`/`twitter` (via `pageMetadata`). Every other page only needs
 * `pageMetadata` — these fields are inherited from here automatically.
 */
export function rootMetadata(lang: Locale, dict: Dictionary): Metadata {
  return {
    ...pageMetadata({
      lang,
      path: "",
      title: {
        default: dict.meta.defaultTitle,
        template: dict.meta.titleTemplate,
      },
      description: dict.meta.description,
    }),
    metadataBase: new URL(siteConfig.url),
    keywords: dict.meta.keywords,
    applicationName: siteConfig.name,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: dict.meta.defaultTitle,
      description: dict.meta.description,
      url: `${siteConfig.url}/${lang}/`,
      locale: localeTag[lang].replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.defaultTitle,
      description: dict.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}
