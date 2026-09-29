import LayerLeaf from "@/components/LayerLeaf";
import CtaLink from "@/components/CtaLink";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import ProductGridSection from "@/components/ProductGridSection";
import CtaBanner from "@/components/CtaBanner";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductItem } from "@/data/products/types";

type HomeScreenProps = {
  lang: Locale;
  dict: Dictionary;
  latestItems: ProductItem[];
};

export default function HomeScreen({ lang, dict, latestItems }: HomeScreenProps) {
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
