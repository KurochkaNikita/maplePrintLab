import Link from "next/link";
import HeaderCartLink from "@/components/cart/HeaderCartLink";
import type { Locale } from "@/lib/i18n";

type HeaderNavProps = {
  lang: Locale;
  items: { href: string; label: string }[];
  navAria: string;
  menuLabel: string;
  /** The request page and the accessible name of its link; the link shows once something is in the list. */
  cartHref: string;
  cartLabel: string;
};

/**
 * Mobile burger menu without JavaScript state: a visually hidden checkbox
 * (the `peer`) toggles the panel through CSS. Must stay a sibling of the label
 * and the panel.
 */
export default function HeaderNav({
  lang,
  items,
  navAria,
  menuLabel,
  cartHref,
  cartLabel,
}: HeaderNavProps) {
  return (
    <>
      <input
        type="checkbox"
        id="site-menu-toggle"
        aria-label={menuLabel}
        aria-controls="site-menu"
        className="peer sr-only"
      />
      {/* Flex order: next to the burger on small screens, after the menu on wide ones. */}
      <HeaderCartLink href={cartHref} label={cartLabel} className="order-1 ml-auto md:order-3 md:ml-0" />
      <label
        htmlFor="site-menu-toggle"
        aria-hidden="true"
        className="order-2 -mr-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded text-charcoal peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber-deep peer-checked:[&_.icon-open]:hidden peer-checked:[&_.icon-close]:block md:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          className="icon-open h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="icon-close hidden h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </label>

      <div
        id="site-menu"
        className="order-3 hidden w-full flex-col gap-y-2 peer-checked:flex md:order-2 md:ml-auto md:flex md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-x-5"
      >
        <nav aria-label={navAria}>
          <ul className="flex flex-col font-mono text-xs uppercase tracking-wider md:flex-row md:flex-wrap md:items-center md:gap-x-5 md:gap-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3 text-charcoal transition-colors hover:text-amber-deep md:inline-block md:rounded-full md:px-3 md:py-2 md:hover:bg-charcoal/5"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
