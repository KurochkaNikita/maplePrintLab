import type { Metadata } from "next";
import Link from "next/link";
import LayerLeaf from "@/components/LayerLeaf";
import WorkCard from "@/components/WorkCard";
import CtaLink from "@/components/CtaLink";
import {
  getDictionary,
  isLocale,
  localeHref,
  locales,
  localeTag,
} from "@/lib/i18n";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  return {
    alternates: {
      canonical: `/${params.lang}/`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [localeTag[l], `/${l}/`])),
        "x-default": "/en/",
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const lang = params.lang;
  const dict = await getDictionary(lang);
  const t = dict.home;

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-14 sm:pt-20">
        <div className="grid items-center gap-10 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-teal">
              {dict.region}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
              {t.hero.title}
            </h1>
            <p className="mt-4 max-w-xl font-accent text-lg italic text-amber-deep">
              {t.hero.accent}
            </p>
            <p className="mt-4 max-w-xl text-ink/80">{t.hero.body}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <CtaLink href={localeHref(lang, "work")}>{t.hero.ctaWork}</CtaLink>
              <CtaLink href={localeHref(lang, "contact")} variant="outline">
                {t.hero.ctaContact}
              </CtaLink>
            </div>
          </div>

          <div className="justify-self-center sm:justify-self-end">
            <LayerLeaf
              className="h-48 w-48 sm:h-60 sm:w-60"
              title={dict.leaf.alt}
            />
          </div>
        </div>
      </section>

      {/* What we make */}
      <section className="border-y border-line bg-white/30">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="font-display text-2xl font-medium">
            {t.whatWeDo.heading}
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {t.whatWeDo.items.map((item) => (
              <div key={item.title}>
                <h3 className="font-display text-lg font-medium text-charcoal">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-ink/80">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest work */}
      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-medium">
            {t.latest.heading}
          </h2>
          <Link
            href={localeHref(lang, "work")}
            className="font-mono text-xs uppercase tracking-wider text-amber hover:text-amber-deep"
          >
            {t.latest.seeAll} →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {t.latest.items.map((item) => (
            <WorkCard
              key={item.title}
              title={item.title}
              material={item.material}
              note={item.note}
              tone={item.tone}
              photoSoonLabel={dict.workCard.photoSoon}
            />
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-line bg-charcoal text-filament">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="font-display text-2xl font-medium text-filament">
            {t.trust.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-filament/80">{t.trust.body}</p>
          <div className="mt-6">
            <CtaLink href={localeHref(lang, "contact")}>{t.trust.cta}</CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
