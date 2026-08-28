import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkCard from "@/components/WorkCard";
import { getDictionary, isLocale, locales, localeTag } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const dict = await getDictionary(params.lang);
  return {
    title: dict.meta.work.title,
    description: dict.meta.work.description,
    alternates: {
      canonical: `/${params.lang}/work/`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [localeTag[l], `/${l}/work/`])),
        "x-default": "/en/work/",
      },
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const dict = await getDictionary(params.lang);
  const t = dict.work;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-8 pt-14">
      <h1 className="font-display text-4xl font-semibold text-charcoal">
        {t.title}
      </h1>
      <p className="mt-3 max-w-2xl text-ink/80">{t.intro}</p>

      {t.categories.map((cat) => (
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
      ))}
    </div>
  );
}
