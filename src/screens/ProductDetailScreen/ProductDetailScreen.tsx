import Image from "next/image";
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
  const [mainImage, ...otherImages] = item.images;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-14">
      <Breadcrumbs ariaLabel={dict.category.breadcrumbAria} items={crumbs} />

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          {mainImage ? (
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              width={mainImage.width}
              height={mainImage.height}
              preload
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/3] w-full rounded-lg border border-line object-cover"
            />
          ) : (
            <div
              className="relative aspect-[4/3] w-full rounded-lg border border-line bg-white"
              aria-hidden="true"
            >
              <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-ink/80">
                {dict.productCard.photoSoon}
              </span>
            </div>
          )}

          {otherImages.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {otherImages.map((img) => (
                <Image
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  unoptimized
                  sizes="(min-width: 768px) 17vw, 33vw"
                  className="aspect-square w-full rounded-md border border-line object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-teal">
            {category.title}
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold text-charcoal">
            {item.title}
          </h1>

          {category.priceTiers ? (
            <PriceTiers lang={lang} dict={dict} tiers={category.priceTiers} className="mt-5" />
          ) : (
            <p className="mt-4 font-display text-2xl text-charcoal">
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

          <div className="mt-8">
            <CtaLink href={`/${lang}/contact/`}>{t.ctaLabel}</CtaLink>
          </div>
        </div>
      </div>
      <ProductJsonLd lang={lang} item={item} priceTiers={category.priceTiers} crumbs={crumbs} />
    </div>
  );
}
