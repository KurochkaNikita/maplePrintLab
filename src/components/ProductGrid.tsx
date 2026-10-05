import ProductCard from "@/components/ProductCard";
import { productHref, type Locale } from "@/lib/i18n";
import type { ProductItem } from "@/lib/products";

type ProductGridProps = {
  lang: Locale;
  items: ProductItem[];
  photoSoonLabel: string;
  /** Preload the first card's image when the grid sits above the fold. */
  preloadFirst?: boolean;
  className?: string;
};

/** Responsive grid of `ProductCard`s — shared by home, work and category pages. */
export default function ProductGrid({
  lang,
  items,
  photoSoonLabel,
  preloadFirst = false,
  className = "",
}: ProductGridProps) {
  return (
    <div className={`grid gap-6 sm:grid-cols-3 ${className}`.trim()}>
      {items.map((item, i) => (
        <ProductCard
          key={item.slug}
          href={productHref(lang, item.slug)}
          title={item.title}
          note={item.note}
          image={item.images[0]}
          photoSoonLabel={photoSoonLabel}
          preload={preloadFirst && i === 0}
        />
      ))}
    </div>
  );
}
