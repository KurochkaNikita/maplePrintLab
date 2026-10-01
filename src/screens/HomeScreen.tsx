import LayerLeaf from "@/components/LayerLeaf";
import CtaLink from "@/components/CtaLink";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import CategoryCarouselSection from "@/components/CategoryCarouselSection";
import ProductGridSection from "@/components/ProductGridSection";
import CtaBanner from "@/components/CtaBanner";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductCategory, ProductItem } from "@/lib/products";

type HomeScreenProps = {
  lang: Locale;
  dict: Dictionary;
  categories: ProductCategory[];
  latestItems: ProductItem[];
};

export default function HomeScreen({ lang, dict, categories, latestItems }: HomeScreenProps) {
  const t = dict.home;

  return (
    <>
      <Hero
        eyebrow={dict.region}
        title={t.hero.title}
        accent={t.hero.accent}
        body={t.hero.body}
        actions={
          <>
            <CtaLink href={localeHref(lang, "products")}>{t.hero.ctaProducts}</CtaLink>
            <CtaLink href={localeHref(lang, "contact")} variant="outline">
              {t.hero.ctaContact}
            </CtaLink>
          </>
        }
        media={<LayerLeaf className="h-48 w-48 sm:h-60 sm:w-60" title={dict.leaf.alt} />}
      />

      <FeatureGrid heading={t.whatWeDo.heading} items={t.whatWeDo.items} />

      <CategoryCarouselSection
        lang={lang}
        heading={t.categories.heading}
        categories={categories}
        countSuffix={t.categories.items}
        coverLabel={dict.productCard.photoSoon}
        prevLabel={t.categories.prev}
        nextLabel={t.categories.next}
      />

      <ProductGridSection
        lang={lang}
        heading={t.latest.heading}
        items={latestItems}
        photoSoonLabel={dict.productCard.photoSoon}
        seeAllHref={localeHref(lang, "products")}
        seeAllLabel={t.latest.seeAll}
      />

      <CtaBanner
        heading={t.trust.heading}
        body={t.trust.body}
        ctaLabel={t.trust.cta}
        ctaHref={localeHref(lang, "contact")}
      />
    </>
  );
}
