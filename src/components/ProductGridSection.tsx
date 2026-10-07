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
    <section className="mx-auto max-w-5xl px-5 py-14">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-medium">{heading}</h2>
        {seeAllHref && seeAllLabel && (
          <Link
            href={seeAllHref}
            className="font-mono text-xs uppercase tracking-wider text-amber-deep hover:text-charcoal"
          >
            {seeAllLabel} →
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
