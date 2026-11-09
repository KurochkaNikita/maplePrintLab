import Link from "next/link";
import type { PeriodId } from "@/lib/finance/period";

export interface PeriodTabsProps {
  /** Accessible name of the group. */
  label: string;
  periods: readonly PeriodId[];
  labels: Record<PeriodId, string>;
  active: PeriodId;
  /** Link of a period (the default period needs no parameter). */
  getHref: (period: PeriodId) => string;
}

/** Period switcher as links: it is navigation (the page reloads with other data), not a tab widget. */
export function PeriodTabs({ label, periods, labels, active, getHref }: PeriodTabsProps) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2">
        {periods.map((period) => {
          const isActive = period === active;
          return (
            <li key={period}>
              <Link
                href={getHref(period)}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-charcoal bg-charcoal text-filament"
                    : "border-charcoal/30 bg-white text-charcoal hover:border-charcoal"
                }`}
              >
                {labels[period]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default PeriodTabs;
