import ProductCard from "@/components/ProductCard";
import { productHref, type Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/price";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductItem } from "@/lib/products";

type ProductGridProps = {
  lang: Locale;
  items: ProductItem[];
  dict: Dictionary;
  /** Preload the first card's image when the grid sits above the fold. */
  preloadFirst?: boolean;
  className?: string;
};

/** Responsive grid of `ProductCard`s — shared by home, work and category pages. */
export default function ProductGrid({
  lang,
  items,
  dict,
  preloadFirst = false,
  className = "",
}: ProductGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-3 ${className}`.trim()}>
      {items.map((item, i) => (
        <ProductCard
          key={item.slug}
          href={productHref(lang, item.slug)}
          title={item.title}
          note={item.note}
          image={item.images[0]}
          price={`${formatPrice(item.price, lang, dict)}${item.volumePricing ? ` ${dict.price.perPiece}` : ""}`}
          photoSoonLabel={dict.productCard.photoSoon}
          newLabel={item.isNew ? dict.productCard.new : undefined}
          preload={preloadFirst && i === 0}
        />
      ))}
    </div>
  );
}
