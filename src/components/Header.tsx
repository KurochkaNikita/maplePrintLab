import Link from "next/link";
import LayerLeaf from "@/components/LayerLeaf";
import HeaderNav from "@/components/HeaderNav";
import { siteConfig } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";

type HeaderProps = {
  lang: Locale;
  dict: Dictionary;
  /** The 404 page: the other language's version of an unknown URL is a 404 too. */
  hideLocaleSwitcher?: boolean;
};

export default function Header({ lang, dict, hideLocaleSwitcher = false }: HeaderProps) {
  const nav = [
    { href: localeHref(lang, ""), label: dict.nav.home },
    { href: localeHref(lang, "products"), label: dict.nav.products },
    { href: localeHref(lang, "how-to-order"), label: dict.nav.howToOrder },
    { href: localeHref(lang, "about"), label: dict.nav.about },
    { href: localeHref(lang, "contact"), label: dict.nav.contact },
  ];

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4">
        <Link
          href={localeHref(lang, "")}
          className="flex items-center gap-2.5 font-display text-lg font-semibold text-charcoal"
        >
          <LayerLeaf className="h-7 w-7" />
          <span>{siteConfig.name}</span>
        </Link>

        <HeaderNav
          lang={lang}
          items={nav}
          navAria={dict.nav.primaryAria}
          menuLabel={dict.nav.menu}
          localeLabel={dict.localeSwitcher.label}
          hideLocaleSwitcher={hideLocaleSwitcher}
        />
      </div>
    </header>
  );
}
