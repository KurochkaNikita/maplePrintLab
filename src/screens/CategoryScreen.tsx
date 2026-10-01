import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryHeader from "@/components/CategoryHeader";
import ProductGrid from "@/components/ProductGrid";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductCategory } from "@/lib/products";

type CategoryScreenProps = {
  lang: Locale;
  dict: Dictionary;
  category: ProductCategory;
};

export default function CategoryScreen({ lang, dict, category }: CategoryScreenProps) {
  const t = dict.category;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-14">
      <Breadcrumbs
        ariaLabel={t.breadcrumbAria}
        items={[
          { label: dict.nav.home, href: localeHref(lang, "") },
          { label: dict.nav.products, href: localeHref(lang, "products") },
          { label: category.title },
        ]}
      />

      <CategoryHeader
        title={category.title}
        intro={category.intro}
        coverLabel={dict.productCard.photoSoon}
      />

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
    </div>
  );
}
