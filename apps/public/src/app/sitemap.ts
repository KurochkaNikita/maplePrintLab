import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { locales, localeTag, defaultLocale, routes, localeHref } from "@/lib/i18n";
import { getProducts } from "@/lib/products";
import { lastModified, latest } from "@/lib/lastmod";

export const dynamic = "force-static";

const abs = (path: string) => new URL(path, siteConfig.url).toString();

/** hreflang map for one page: every locale plus `x-default` (→ default locale). */
function languages(pathFor: (lang: (typeof locales)[number]) => string) {
  return {
    ...Object.fromEntries(locales.map((l) => [localeTag[l], abs(pathFor(l))])),
    "x-default": abs(pathFor(defaultLocale)),
  };
}

/**
 * `lastModified` is the date of the last git commit that touched the page's
 * source (data, copy, screen), not the build time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Slugs and category ids are shared across locales, so the default locale's catalog lists them.
  const catalog = await getProducts(locales[0]);
  const items = catalog.flatMap((c) => c.items);

  const dictionaries = lastModified("src/lib/dictionaries");
  const catalogDate = latest(...catalog.map((c) => c.updatedAt), ...items.map((i) => i.updatedAt));

  const routeDate = {
    "": latest(catalogDate, dictionaries, lastModified("src/screens/HomeScreen.tsx")),
    products: latest(catalogDate, dictionaries, lastModified("src/screens/ProductScreen.tsx")),
    "how-to-order": latest(dictionaries, lastModified("src/screens/HowToOrderScreen.tsx")),
    about: latest(dictionaries, lastModified("src/screens/AboutScreen.tsx")),
    contact: latest(dictionaries, lastModified("src/screens/ContactScreen.tsx", "src/lib/site-config.ts")),
  } satisfies Record<(typeof routes)[number], Date | undefined>;

  const pages = locales.flatMap((lang) =>
    routes.map((route) => ({
      url: abs(localeHref(lang, route)),
      lastModified: routeDate[route],
      changeFrequency: "yearly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: { languages: languages((l) => localeHref(l, route)) },
    })),
  );

  // `noindex` products stay live but are left out of the sitemap.
  const products = locales.flatMap((lang) =>
    items
      .filter((item) => !item.noindex)
      .map((item) => ({
        url: abs(`/${lang}/product/${item.slug}/`),
        lastModified: latest(item.updatedAt, catalog.find((c) => c.id === item.categoryId)?.updatedAt),
        changeFrequency: "yearly" as const,
        priority: 0.6,
        alternates: { languages: languages((l) => `/${l}/product/${item.slug}/`) },
      })),
  );

  const categories = locales.flatMap((lang) =>
    catalog.map((cat) => ({
      url: abs(`/${lang}/category/${cat.id}/`),
      lastModified: latest(cat.updatedAt, ...cat.items.map((i) => i.updatedAt)),
      changeFrequency: "yearly" as const,
      priority: 0.7,
      alternates: { languages: languages((l) => `/${l}/category/${cat.id}/`) },
    })),
  );

  // Collection pages are hidden for now (see `getCollections`).
  return [...pages, ...categories, ...products];
}
