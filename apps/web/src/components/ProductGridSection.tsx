import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductItem } from "@/lib/products";

type ProductGridSectionProps = {
  lang: Locale;
  heading: string;
  /** Short line under the heading. */
  intro?: string;
  items: ProductItem[];
  dict: Dictionary;
  seeAllHref?: string;
  seeAllLabel?: string;
};

export default function ProductGridSection({
  lang,
  heading,
  intro,
  items,
  dict,
  seeAllHref,
  seeAllLabel,
}: ProductGridSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">{heading}</h2>
          <div className="layer-bar mt-3 w-24 rounded-full" aria-hidden="true" />
        </div>
        {seeAllHref && seeAllLabel && (
          <Link
            href={seeAllHref}
            className="inline-block shrink-0 whitespace-nowrap py-2 font-mono text-xs uppercase tracking-wider text-amber-deep hover:text-charcoal"
          >
            {seeAllLabel}&nbsp;→
          </Link>
        )}
      </div>
      {intro && <p className="mt-2 max-w-2xl text-ink/80">{intro}</p>}
      <ProductGrid
        lang={lang}
        items={items}
        dict={dict}
        className="mt-8"
      />
    </section>
  );
}
