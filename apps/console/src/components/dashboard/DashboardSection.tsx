import type { ReactNode } from "react";
import Link from "next/link";

export interface DashboardSectionProps {
  /** Id of the heading, which names the section. */
  id: string;
  title: string;
  /** Link on the right of the heading, to the full page behind the block. */
  more?: { href: string; label: string };
  children: ReactNode;
}

/** A titled block of the dashboard. */
export function DashboardSection({ id, title, more, children }: DashboardSectionProps) {
  return (
    <section aria-labelledby={id} className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4">
        <h2 id={id} className="font-display text-lg font-semibold text-charcoal">
          {title}
        </h2>
        {more && (
          <Link href={more.href} className="inline-flex min-h-11 items-center text-sm font-semibold text-amber-deep underline-offset-4 hover:underline">
            {more.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export default DashboardSection;
