import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Locale } from "@/lib/i18n";
import type { ProductItem } from "@/data/products/types";

type ProductGridSectionProps = {
  lang: Locale;
  heading: string;
  items: ProductItem[];
  photoSoonLabel: string;
  seeAllHref?: string;
  seeAllLabel?: string;
};

export default function ProductGridSection({
  lang,
  heading,
  items,
  photoSoonLabel,
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
            className="font-mono text-xs uppercase tracking-wider text-amber hover:text-amber-deep"
          >
            {seeAllLabel} →
          </Link>
        )}
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <ProductCard
            key={item.slug}
            href={`/${lang}/product/${item.slug}/`}
            title={item.title}
            material={item.material}
            note={item.note}
            tone={item.tone}
            photoSoonLabel={photoSoonLabel}
          />
        ))}
      </div>
    </section>
  );
}
