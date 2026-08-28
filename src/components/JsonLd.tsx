import { siteConfig } from "@/lib/site-config";
import { localeTag, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";

type JsonLdProps = {
  lang: Locale;
  dict: Dictionary;
};

/**
 * LocalBusiness / Store structured data for local SEO.
 * Rendered once per page from app/[lang]/layout.tsx.
 */
export default function JsonLd({ lang, dict }: JsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteConfig.name,
    description: dict.meta.description,
    inLanguage: localeTag[lang],
    url: `${siteConfig.url}/${lang}/`,
    email: siteConfig.email,
    image: `${siteConfig.url}/og-image.jpg`,
    priceRange: "$$",
    sameAs: [siteConfig.instagram],
    areaServed: {
      "@type": "AdministrativeArea",
      name: dict.region,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: dict.home.hero.title,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
