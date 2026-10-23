"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaLink from "@/components/CtaLink";
import { defaultLocale, isLocale, localeHref, localeTag, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";

/**
 * One 404.html serves every unknown URL, so the language is picked on the
 * client: the locale prefix of the requested path (`/fr/oops/`), else the
 * browser language, else English (what the static HTML and crawlers get).
 */
function detectLocale(dicts: Record<Locale, Dictionary>): Locale {
  const prefix = window.location.pathname.split("/")[1] ?? "";
  if (isLocale(prefix)) return prefix;

  const preferred = (navigator.languages?.[0] ?? navigator.language ?? "").toLowerCase();
  return (Object.keys(dicts) as Locale[]).find((l) => l !== defaultLocale && preferred.startsWith(l)) ?? defaultLocale;
}

export default function NotFoundView({ dicts }: { dicts: Record<Locale, Dictionary> }) {
  const [lang, setLang] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const detected = detectLocale(dicts);
    setLang(detected);
    document.documentElement.lang = localeTag[detected];
  }, [dicts]);

  const dict = dicts[lang];
  const t = dict.notFound;

  return (
    <>
      <Header lang={lang} dict={dict} hideLocaleSwitcher />
      <main className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-teal">{t.code}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-charcoal">{t.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-ink/80">{t.body}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <CtaLink href={localeHref(lang, "")}>{t.home}</CtaLink>
            <CtaLink href={localeHref(lang, "products")} variant="outline">
              {t.products}
            </CtaLink>
            <CtaLink href={localeHref(lang, "contact")} variant="outline">
              {t.contact}
            </CtaLink>
          </div>
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
