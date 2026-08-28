import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
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
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
    alternates: {
      canonical: `/${params.lang}/contact/`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [localeTag[l], `/${l}/contact/`]),
        ),
        "x-default": "/en/contact/",
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const dict = await getDictionary(params.lang);
  const t = dict.contact;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-14">
      <h1 className="font-display text-4xl font-semibold text-charcoal">
        {t.title}
      </h1>
      <p className="mt-4 max-w-xl text-ink/80">{t.intro}</p>

      <dl className="mt-10 space-y-6">
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-teal">
            {t.emailLabel}
          </dt>
          <dd className="mt-1">
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-display text-lg text-charcoal hover:text-amber"
            >
              {siteConfig.email}
            </a>
          </dd>
        </div>

        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-teal">
            {t.instagramLabel}
          </dt>
          <dd className="mt-1">
            <a
              href={siteConfig.instagram}
              rel="me noopener"
              target="_blank"
              className="font-display text-lg text-charcoal hover:text-amber"
            >
              {siteConfig.instagramHandle}
            </a>
          </dd>
        </div>

        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-teal">
            {t.regionLabel}
          </dt>
          <dd className="mt-1 font-display text-lg text-charcoal">
            {dict.region}
          </dd>
        </div>
      </dl>

      <p className="mt-10 text-sm text-ink/60">{t.note}</p>
    </div>
  );
}
