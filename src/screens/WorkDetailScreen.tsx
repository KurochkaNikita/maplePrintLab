import Link from "next/link";
import CtaLink from "@/components/CtaLink";
import { TONE_GRADIENT } from "@/lib/tone";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductCategory, ProductItem } from "@/data/products/types";

type WorkDetailScreenProps = {
  lang: Locale;
  dict: Dictionary;
  item: ProductItem;
  category: ProductCategory;
};

export default function WorkDetailScreen({
  lang,
  dict,
  item,
  category,
}: WorkDetailScreenProps) {
  const t = dict.product;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-14">
      <Link
        href={`/${lang}/work/`}
        className="font-mono text-xs uppercase tracking-wider text-teal hover:text-amber"
      >
        ← {t.backLabel}
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <div
            className={`aspect-[4/3] w-full rounded-lg bg-gradient-to-br ${TONE_GRADIENT[item.tone]} relative`}
            aria-hidden="true"
          >
            <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-filament/80">
              {dict.workCard.photoSoon}
            </span>
          </div>

          {item.imageCount > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {Array.from({ length: item.imageCount - 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-md bg-gradient-to-br ${TONE_GRADIENT[item.tone]}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-teal">
            {category.title}
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold text-charcoal">
            {item.title}
          </h1>

          <p className="mt-4 font-display text-2xl text-charcoal">
            {item.price}
          </p>

          <p className="mt-5 max-w-md text-ink/80">{item.description}</p>

          <dl className="mt-8 space-y-4 border-t border-line pt-6">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-teal">
                {t.materialLabel}
              </dt>
              <dd className="mt-1 text-ink/80">{item.material}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-teal">
                {t.sizesLabel}
              </dt>
              <dd className="mt-1">
                <ul className="space-y-1 text-ink/80">
                  {item.sizes.map((size) => (
                    <li key={size}>{size}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <CtaLink href={`/${lang}/contact/`}>{t.ctaLabel}</CtaLink>
          </div>
        </div>
      </div>
    </div>
  );
}
