import { siteConfig } from "@/lib/site-config";
import { localeTag, productHref, type Locale } from "@/lib/i18n";
import type { Crumb } from "@/components/Breadcrumbs";
import type { ProductCategory } from "@/lib/products";

type CategoryJsonLdProps = {
  lang: Locale;
  category: ProductCategory;
  /** Same crumbs the page renders; the last one is the category itself. */
  crumbs: Required<Crumb>[];
};

const abs = (path: string) => new URL(path, siteConfig.url).toString();

/** CollectionPage + BreadcrumbList (+ FAQPage when the category has FAQ) as one @graph. */
export default function CategoryJsonLd({ lang, category, crumbs }: CategoryJsonLdProps) {
  const pageUrl = abs(crumbs[crumbs.length - 1].href);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: category.title,
        description: category.seo.description,
        inLanguage: localeTag[lang],
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: category.items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: abs(productHref(lang, item.slug)),
            name: item.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.label,
          item: abs(c.href),
        })),
      },
      ...(category.seoBlock
        ? [
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              inLanguage: localeTag[lang],
              mainEntity: category.seoBlock.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
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
