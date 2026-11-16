import Image from "next/image";
import Link from "next/link";
import HeaderNav from "@/components/HeaderNav";
import { siteConfig } from "@/lib/site-config";
import { localeHref, requestHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";

type HeaderProps = {
  lang: Locale;
  dict: Dictionary;
};

export default function Header({ lang, dict }: HeaderProps) {
  const nav = [
    { href: localeHref(lang, ""), label: dict.nav.home },
    { href: localeHref(lang, "products"), label: dict.nav.products },
    { href: localeHref(lang, "how-to-order"), label: dict.nav.howToOrder },
    { href: localeHref(lang, "about"), label: dict.nav.about },
    { href: localeHref(lang, "contact"), label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-filament/90 backdrop-blur supports-[backdrop-filter]:bg-filament/75">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4">
        <Link
          href={localeHref(lang, "")}
          className="flex items-center gap-2.5 py-1 font-display text-lg font-semibold tracking-tight text-charcoal"
        >
          <Image
            src="/brand/logo-on-light.svg"
            alt=""
            aria-hidden="true"
            width={32}
            height={36}
            className="h-9 w-8"
          />
          <span>{siteConfig.name}</span>
        </Link>

        <HeaderNav
          lang={lang}
          items={nav}
          navAria={dict.nav.primaryAria}
          menuLabel={dict.nav.menu}
          cartHref={requestHref(lang)}
          cartLabel={dict.order.cartLink}
        />
      </div>
    </header>
  );
}
