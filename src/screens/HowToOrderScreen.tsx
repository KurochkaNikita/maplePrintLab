import CtaLink from "@/components/CtaLink";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";

type HowToOrderScreenProps = {
  lang: Locale;
  dict: Dictionary;
};

export default function HowToOrderScreen({ lang, dict }: HowToOrderScreenProps) {
  const t = dict.howToOrder;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-14">
      <h1 className="font-display text-4xl font-semibold text-charcoal">{t.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/80">{t.intro}</p>

      <section className="mt-12" aria-labelledby="order-steps">
        <h2 id="order-steps" className="font-display text-2xl font-medium text-charcoal">
          {t.stepsHeading}
        </h2>
        <ol className="mt-6 space-y-6">
          {t.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-sm text-filament"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-medium text-charcoal">{step.title}</h3>
                <p className="mt-1 max-w-xl text-ink/80">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14" aria-labelledby="order-facts">
        <h2 id="order-facts" className="font-display text-2xl font-medium text-charcoal">
          {t.factsHeading}
        </h2>
        <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-y border-line py-6 sm:grid-cols-[10rem_1fr]">
          {t.facts.map((fact) => (
            <div key={fact.label} className="contents">
              <dt className="font-mono text-xs uppercase tracking-wider text-teal">{fact.label}</dt>
              <dd className="mb-2 text-charcoal sm:mb-0">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-10">
        <CtaLink href={localeHref(lang, "contact")}>{t.ctaLabel}</CtaLink>
      </div>
    </div>
  );
}
