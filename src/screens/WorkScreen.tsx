import WorkCard from "@/components/WorkCard";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductCatalog } from "@/data/products/types";

type WorkScreenProps = {
  lang: Locale;
  dict: Dictionary;
  catalog: ProductCatalog;
};

export default function WorkScreen({ lang, dict, catalog }: WorkScreenProps) {
  const t = dict.work;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-14">
      <h1 className="font-display text-4xl font-semibold text-charcoal">
        {t.title}
      </h1>
      <p className="mt-3 max-w-2xl text-ink/80">{t.intro}</p>

      {catalog.map((cat) => (
        <section key={cat.id} className="mt-14" aria-labelledby={`cat-${cat.id}`}>
          <h2
            id={`cat-${cat.id}`}
            className="font-display text-2xl font-medium text-charcoal"
          >
            {cat.title}
          </h2>
          <p className="mt-1.5 text-sm text-ink/70">{cat.intro}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {cat.items.map((item) => (
              <WorkCard
                key={item.slug}
                href={`/${lang}/work/${item.slug}/`}
                title={item.title}
                material={item.material}
                note={item.note}
                tone={item.tone}
                photoSoonLabel={dict.workCard.photoSoon}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
