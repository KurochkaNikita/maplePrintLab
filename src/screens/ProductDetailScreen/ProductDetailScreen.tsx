import ProductGallery from "@/components/ProductGallery";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatDimensions } from "@/lib/dimensions";
import { formatPrice } from "@/lib/price";
import PriceTiers from "@/components/PriceTiers";
import CtaLink from "@/components/CtaLink";
import { categoryHref, collectionHref, localeHref, productHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductCategory, ProductCollection, ProductItem } from "@/lib/products";
import ProductJsonLd from "./ProductJsonLd";

type ProductDetailScreenProps = {
  lang: Locale;
  dict: Dictionary;
  item: ProductItem;
  category: ProductCategory;
  collections: ProductCollection[];
};

export default function ProductDetailScreen({
  lang,
  dict,
  item,
  category,
  collections,
}: ProductDetailScreenProps) {
  const t = dict.product;
  const crumbs = [
    { label: dict.nav.home, href: localeHref(lang, "") },
    { label: dict.nav.products, href: localeHref(lang, "products") },
    { label: category.title, href: categoryHref(lang, category.id) },
    { label: item.title, href: productHref(lang, item.slug) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-14">
      <Breadcrumbs ariaLabel={dict.category.breadcrumbAria} items={crumbs} />

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <ProductGallery images={item.images} photoSoonLabel={dict.productCard.photoSoon} labels={t.gallery} />
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <p className="font-mono text-xs uppercase tracking-wider text-teal">
            {category.title}
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold text-charcoal">
            {item.title}
          </h1>

          {category.priceTiers ? (
            <PriceTiers lang={lang} dict={dict} tiers={category.priceTiers} className="mt-5" />
          ) : (
            <p className="mt-4 font-display text-4xl font-semibold text-charcoal">
              {formatPrice(item.price, lang, dict)}
            </p>
          )}

          <dl className="mt-5 grid max-w-md grid-cols-[6rem_1fr] items-baseline gap-x-4 gap-y-3 border-y border-line py-4">
            <dt className="font-mono text-xs uppercase tracking-wider text-teal">
              {t.sizeLabel}
            </dt>
            <dd className="text-charcoal">{formatDimensions(item.dimensions, lang, dict)}</dd>
            <dt className="font-mono text-xs uppercase tracking-wider text-teal">
              {t.materialLabel}
            </dt>
            <dd className="text-charcoal">{item.material}</dd>
            {category.customColours && (
              <>
                <dt className="font-mono text-xs uppercase tracking-wider text-teal">
                  {t.coloursLabel}
                </dt>
                <dd className="text-charcoal">{t.coloursValue}</dd>
              </>
            )}
          </dl>

          <div className="mt-6 max-w-md rounded-2xl border border-line bg-white p-5 shadow-sm">
            <CtaLink href={`/${lang}/contact/`} className="w-full">
              {t.ctaLabel}
            </CtaLink>
            <p className="mt-3 text-center text-sm text-ink/80">{t.ctaNote}</p>
            <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm text-charcoal">
              {t.perks.map((perk) => (
                <li key={perk} className="flex gap-2.5">
                  <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-teal" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 max-w-md text-ink/80">{item.description}</p>

          {item.highlights.length > 0 && (
            <>
              <h2 className="mt-6 font-display text-xl font-semibold text-charcoal">
                {t.highlightsHeading}
              </h2>
              <ul className="mt-3 max-w-md list-disc space-y-2 pl-5 text-ink/80">
                {item.highlights.map((h) => (
                  <li key={h.title}>
                    <strong className="font-semibold text-charcoal">{h.title}</strong> {h.text}
                  </li>
                ))}
              </ul>
              <p className="mt-4 max-w-md text-ink/80">{t.exploreMore}</p>
            </>
          )}

          {collections.length > 0 && (
            <nav className="mt-6" aria-label={dict.collection.productHeading}>
              <ul className="flex flex-wrap items-center gap-2">
                <li className="text-sm text-ink/80">{dict.collection.productHeading}:</li>
                {collections.map((col) => (
                  <li key={col.id}>
                    <Link
                      href={collectionHref(lang, col.id)}
                      className="inline-block rounded-full border border-line px-3 py-2 text-sm font-medium text-charcoal hover:border-amber-deep hover:text-amber-deep"
                    >
                      {col.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
      <ProductJsonLd lang={lang} item={item} priceTiers={category.priceTiers} crumbs={crumbs} />
    </div>
  );
}
