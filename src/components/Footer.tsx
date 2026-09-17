import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";

type FooterProps = {
  lang: Locale;
  dict: Dictionary;
};

export default function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();
  const nav = [
    { href: localeHref(lang, ""), label: dict.nav.home },
    { href: localeHref(lang, "work"), label: dict.nav.work },
    { href: localeHref(lang, "contact"), label: dict.nav.contact },
  ];

  return (
    <footer className="border-t border-line bg-charcoal text-filament">
      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-base font-semibold">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-filament/70">{dict.region}</p>
        </div>

        <div className="font-mono text-xs uppercase tracking-wider text-filament/70">
          <p className="mb-2 text-filament">{dict.footer.contactHeading}</p>
          <ul className="space-y-1.5 normal-case tracking-normal">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-amber">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.instagram}
                className="hover:text-amber"
                rel="me noopener"
                target="_blank"
              >
                Instagram {siteConfig.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <nav
          aria-label={dict.nav.footerAria}
          className="font-mono text-xs uppercase tracking-wider text-filament/70"
        >
          <p className="mb-2 text-filament">{dict.footer.sectionsHeading}</p>
          <ul className="space-y-1.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-amber">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-filament/10">
        <p className="mx-auto max-w-5xl px-5 py-5 text-xs text-filament/50">
          © {year} {siteConfig.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
