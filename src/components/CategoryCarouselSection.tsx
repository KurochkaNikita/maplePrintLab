import CategoryCard from "@/components/CategoryCard";
import Carousel from "@/components/Carousel";
import { categoryHref, type Locale } from "@/lib/i18n";
import type { ProductCategory } from "@/lib/products";

type CategoryCarouselSectionProps = {
  lang: Locale;
  heading: string;
  categories: ProductCategory[];
  countSuffix: string;
  coverLabel: string;
  prevLabel: string;
  nextLabel: string;
};

export default function CategoryCarouselSection({
  lang,
  heading,
  categories,
  countSuffix,
  coverLabel,
  prevLabel,
  nextLabel,
}: CategoryCarouselSectionProps) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-14">
      <Carousel
        heading={<h2 className="font-display text-2xl font-medium">{heading}</h2>}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
      >
        {categories.map((c) => (
          <CategoryCard
            key={c.id}
            href={categoryHref(lang, c.id)}
            title={c.title}
            intro={c.intro}
            countLabel={`${c.items.length} ${countSuffix}`}
            coverLabel={coverLabel}
          />
        ))}
      </Carousel>
    </section>
  );
}
