import CtaLink from "@/components/CtaLink";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";

type AboutScreenProps = {
  lang: Locale;
  dict: Dictionary;
};

export default function AboutScreen({ lang, dict }: AboutScreenProps) {
  const t = dict.about;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-14">
      <h1 className="font-display text-4xl font-semibold text-charcoal">{t.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/80">{t.intro}</p>

      {t.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="font-display text-2xl font-medium text-charcoal">{section.heading}</h2>
          <p className="mt-3 max-w-2xl text-ink/80">{section.body}</p>
        </section>
      ))}

      <section className="mt-14 border-t border-line pt-10">
        <h2 className="font-display text-2xl font-medium text-charcoal">{t.ctaHeading}</h2>
        <div className="mt-5">
          <CtaLink href={localeHref(lang, "contact")}>{t.ctaLabel}</CtaLink>
        </div>
      </section>
    </div>
  );
}
