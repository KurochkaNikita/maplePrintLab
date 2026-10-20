import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: t.pages.dashboard.metaTitle,
};

const cards = [
  {
    href: "/products",
    title: t.pages.products.heading,
    description: t.pages.products.description,
  },
  {
    href: "/categories",
    title: t.pages.categories.heading,
    description: t.pages.categories.description,
  },
  {
    href: "/collections",
    title: t.pages.collections.heading,
    description: t.pages.collections.description,
  },
  {
    href: "/redirects",
    title: t.pages.redirects.heading,
    description: t.pages.redirects.description,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title={t.pages.dashboard.heading}
        description={t.pages.dashboard.description}
      />

      <section aria-labelledby="sections-heading">
        <h2
          id="sections-heading"
          className="font-display text-lg font-semibold text-charcoal"
        >
          {t.pages.dashboard.quickLinksHeading}
        </h2>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm transition-colors hover:border-charcoal"
              >
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal group-hover:text-amber-deep">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink">
                    {card.description}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-amber-deep">
                  <span>{t.pages.dashboard.openSection}</span>
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
