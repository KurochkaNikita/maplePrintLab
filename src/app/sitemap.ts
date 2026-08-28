import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { locales, localeTag, routes, localeHref } from "@/lib/i18n";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((lang) =>
    routes.map((route) => ({
      url: new URL(localeHref(lang, route), siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: route === "" ? "monthly" : "yearly",
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
}
