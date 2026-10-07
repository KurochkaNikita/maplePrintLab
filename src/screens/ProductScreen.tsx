import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { categoryHref, collectionHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductCatalog, ProductCollection } from "@/lib/products";

type ProductScreenProps = {
  lang: Locale;
  dict: Dictionary;
  catalog: ProductCatalog;
  collections: ProductCollection[];
};

export default function ProductScreen({ lang, dict, catalog, collections }: ProductScreenProps) {
  const t = dict.products;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-14">
      <h1 className="font-display text-4xl font-semibold text-charcoal">
        {t.title}
      </h1>
      <p className="mt-3 max-w-2xl text-ink/80">{t.intro}</p>

      {collections.length > 0 && (
        <nav className="mt-8" aria-label={dict.collection.heading}>
          <ul className="flex flex-wrap gap-3">
            {collections.map((col) => (
              <li key={col.id}>
                <Link
                  href={collectionHref(lang, col.id)}
                  className="inline-block rounded-full border border-line px-4 py-2 text-sm font-medium text-charcoal hover:border-amber-deep hover:text-amber-deep"
                >
                  {col.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {catalog.map((cat, i) => (
        <section key={cat.id} className="mt-14" aria-labelledby={`cat-${cat.id}`}>
          <h2
            id={`cat-${cat.id}`}
            className="font-display text-2xl font-medium text-charcoal"
          >
            {cat.title}
          </h2>
          <p className="mt-1.5 text-sm text-ink/80">{cat.intro}</p>
          <ProductGrid
            lang={lang}
            items={cat.items}
            dict={dict}
            preloadFirst={i === 0}
            className="mt-6"
          />
          <Link
            href={categoryHref(lang, cat.id)}
            className="mt-5 inline-block whitespace-nowrap py-2 font-mono text-xs uppercase tracking-wider text-amber-deep hover:text-charcoal"
          >
            {dict.category.viewAll}&nbsp;→
          </Link>
        </section>
      ))}
    </div>
  );
}
