import Link from "next/link";
import LayerLeaf from "@/components/LayerLeaf";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { siteConfig } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";

type HeaderProps = {
  lang: Locale;
  dict: Dictionary;
};

export default function Header({ lang, dict }: HeaderProps) {
  const nav = [
    { href: localeHref(lang, ""), label: dict.nav.home },
    { href: localeHref(lang, "work"), label: dict.nav.work },
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

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <nav aria-label={dict.nav.primaryAria}>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs uppercase tracking-wider">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink transition-colors hover:text-amber"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <LocaleSwitcher current={lang} label={dict.localeSwitcher.label} />
        </div>
      </div>
    </header>
  );
}
