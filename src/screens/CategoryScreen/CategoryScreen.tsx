import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryHeader from "@/components/CategoryHeader";
import ContentSections from "@/components/ContentSections";
import FaqList from "@/components/FaqList";
import PriceTiers from "@/components/PriceTiers";
import ProductGrid from "@/components/ProductGrid";
import { categoryHref, localeHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductCategory } from "@/lib/products";
import CategoryJsonLd from "./CategoryJsonLd";

type CategoryScreenProps = {
  lang: Locale;
  dict: Dictionary;
  category: ProductCategory;
};

export default function CategoryScreen({ lang, dict, category }: CategoryScreenProps) {
  const t = dict.category;
  const crumbs = [
    { label: dict.nav.home, href: localeHref(lang, "") },
    { label: dict.nav.products, href: localeHref(lang, "products") },
    { label: category.title, href: categoryHref(lang, category.id) },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-14">
      <Breadcrumbs
        ariaLabel={t.breadcrumbAria}
        items={crumbs}
      />

      <CategoryHeader
        title={category.title}
        intro={category.intro}
        highlight={category.highlight}
        coverLabel={dict.productCard.photoSoon}
      />

      {category.priceTiers && (
        <PriceTiers lang={lang} dict={dict} tiers={category.priceTiers} className="mt-10" />
      )}

      <section className="mt-14" aria-label={t.itemsAria}>
        {category.items.length > 0 ? (
          <ProductGrid
            lang={lang}
            items={category.items}
            photoSoonLabel={dict.productCard.photoSoon}
            className="lg:grid-cols-4"
          />
        ) : (
          <p className="text-ink/70">{t.empty}</p>
        )}
      </section>

      {category.seoBlock && (
        <div className="mt-20 max-w-2xl">
          <ContentSections sections={category.seoBlock.sections} />
          <FaqList className="mt-14" heading={t.faqHeading} items={category.seoBlock.faq} />
        </div>
      )}

      <CategoryJsonLd lang={lang} category={category} crumbs={crumbs} />
    </div>
  );
}
