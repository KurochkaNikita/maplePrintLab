import ProductCard from "@/components/ProductCard";
import { productHref, type Locale } from "@/lib/i18n";
import type { ProductItem } from "@/lib/products";

type ProductGridProps = {
  lang: Locale;
  items: ProductItem[];
  photoSoonLabel: string;
  className?: string;
};

/** Responsive grid of `ProductCard`s — shared by home, work and category pages. */
export default function ProductGrid({
  lang,
  items,
  photoSoonLabel,
  className = "",
}: ProductGridProps) {
  return (
    <div className={`grid gap-6 sm:grid-cols-3 ${className}`.trim()}>
      {items.map((item) => (
        <ProductCard
          key={item.slug}
          href={productHref(lang, item.slug)}
          title={item.title}
          note={item.note}
          photoSoonLabel={photoSoonLabel}
        />
      ))}
    </div>
  );
}
