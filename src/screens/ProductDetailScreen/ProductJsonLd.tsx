import { siteConfig } from "@/lib/site-config";
import { localeTag, productHref, type Locale } from "@/lib/i18n";
import type { Crumb } from "@/components/Breadcrumbs";
import type { PriceTier } from "@/db";
import type { ProductItem } from "@/lib/products";

type ProductJsonLdProps = {
  lang: Locale;
  item: ProductItem;
  /** Volume pricing of the category; emitted as an AggregateOffer. */
  priceTiers?: PriceTier[];
  /** Same crumbs the page renders; the last one is the product itself. */
  crumbs: Required<Crumb>[];
};

const abs = (path: string) => new URL(path, siteConfig.url).toString();

/**
 * Product + BreadcrumbList as one @graph. Price and currency come from the
 * catalog; `availability` and reviews are left out until the data has them.
 */
export default function ProductJsonLd({ lang, item, priceTiers, crumbs }: ProductJsonLdProps) {
  const url = abs(productHref(lang, item.slug));

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        url,
        name: item.title,
        description: item.description,
        sku: item.slug,
        material: item.material,
        width: { "@type": "QuantitativeValue", value: item.dimensions.cm[0], unitCode: "CMT" },
        height: { "@type": "QuantitativeValue", value: item.dimensions.cm[1], unitCode: "CMT" },
        depth: { "@type": "QuantitativeValue", value: item.dimensions.cm[2], unitCode: "CMT" },
        inLanguage: localeTag[lang],
        image: item.images.map((img) => abs(img.src)),
        brand: { "@type": "Brand", name: siteConfig.name },
        offers: priceTiers
          ? {
              "@type": "AggregateOffer",
              url,
              priceCurrency: item.price.currency,
              lowPrice: Math.min(...priceTiers.map((t) => t.amount)).toFixed(2),
              highPrice: Math.max(...priceTiers.map((t) => t.amount)).toFixed(2),
              offerCount: priceTiers.length,
            }
          : {
              "@type": "Offer",
              url,
              price: item.price.amount.toFixed(2),
              priceCurrency: item.price.currency,
            },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.label,
          item: abs(c.href),
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
