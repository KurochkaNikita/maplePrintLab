import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { locales, localeTag, routes, localeHref } from "@/lib/i18n";
import { allProductSlugs, getProducts } from "@/lib/products";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const catalog = await getProducts(locales[0]);
  const slugs = allProductSlugs(catalog);
  const categoryIds = catalog.map((c) => c.id);

  const pages = locales.flatMap((lang) =>
    routes.map((route) => ({
      url: new URL(localeHref(lang, route), siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: route === "" ? ("monthly" as const) : ("yearly" as const),
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            localeTag[l],
            new URL(localeHref(l, route), siteConfig.url).toString(),
          ]),
        ),
      },
    })),
  );

  const products = locales.flatMap((lang) =>
    slugs.map((slug) => ({
      url: new URL(`/${lang}/product/${slug}/`, siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            localeTag[l],
            new URL(`/${l}/product/${slug}/`, siteConfig.url).toString(),
          ]),
        ),
      },
    })),
  );

  const categories = locales.flatMap((lang) =>
    categoryIds.map((id) => ({
      url: new URL(`/${lang}/category/${id}/`, siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            localeTag[l],
            new URL(`/${l}/category/${id}/`, siteConfig.url).toString(),
          ]),
        ),
      },
    })),
  );

  return [...pages, ...categories, ...products];
}
