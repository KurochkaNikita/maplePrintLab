import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatDimensions } from "@/lib/dimensions";
import { formatPrice } from "@/lib/price";
import CtaLink from "@/components/CtaLink";
import { categoryHref, localeHref, productHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductCategory, ProductItem } from "@/lib/products";
import ProductJsonLd from "./ProductJsonLd";

type ProductDetailScreenProps = {
  lang: Locale;
  dict: Dictionary;
  item: ProductItem;
  category: ProductCategory;
};

export default function ProductDetailScreen({
  lang,
  dict,
  item,
  category,
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
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/3] w-full rounded-lg border border-line object-cover"
            />
          ) : (
            <div
              className="relative aspect-[4/3] w-full rounded-lg border border-line bg-white"
              aria-hidden="true"
            >
              <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-ink/50">
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

          <p className="mt-4 font-display text-2xl text-charcoal">
            {formatPrice(item.price, lang, dict)}
          </p>

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

          <div className="mt-8">
            <CtaLink href={`/${lang}/contact/`}>{t.ctaLabel}</CtaLink>
          </div>
        </div>
      </div>
      <ProductJsonLd lang={lang} item={item} crumbs={crumbs} />
    </div>
  );
}
