import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import { collectionHref, localeHref, productHref, localeTag, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductCollection } from "@/lib/products";

type CollectionScreenProps = {
  lang: Locale;
  dict: Dictionary;
  collection: ProductCollection;
};

const abs = (path: string) => new URL(path, siteConfig.url).toString();

export default function CollectionScreen({ lang, dict, collection }: CollectionScreenProps) {
  const crumbs = [
    { label: dict.nav.home, href: localeHref(lang, "") },
    { label: dict.nav.products, href: localeHref(lang, "products") },
    { label: collection.title, href: collectionHref(lang, collection.id) },
  ];
  const pageUrl = abs(crumbs[crumbs.length - 1].href);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: collection.title,
        description: collection.seo.description,
        inLanguage: localeTag[lang],
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: collection.items.map((item, i) => ({
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
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-14">
      <Breadcrumbs ariaLabel={dict.category.breadcrumbAria} items={crumbs} />

      <header className="mt-6">
        <h1 className="font-display text-4xl font-semibold text-charcoal">{collection.title}</h1>
        <p className="mt-3 max-w-2xl text-ink/80">{collection.intro}</p>
      </header>

      <section className="mt-12" aria-label={dict.collection.itemsAria}>
        {collection.items.length > 0 ? (
          <ProductGrid lang={lang} items={collection.items} dict={dict} preloadFirst className="lg:grid-cols-4" />
        ) : (
          <p className="text-ink/80">{dict.collection.empty}</p>
        )}
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
