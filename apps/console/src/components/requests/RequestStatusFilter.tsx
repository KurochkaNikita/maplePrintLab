import Link from "next/link";

export interface RequestStatusFilterItem {
  key: string;
  label: string;
  href: string;
  count: number;
  active: boolean;
}

export interface RequestStatusFilterProps {
  /** Accessible name of the group of links. */
  label: string;
  items: RequestStatusFilterItem[];
}

/** Row of links, one per status, with the number of requests; the current one is marked with `aria-current`. */
export function RequestStatusFilter({ label, items }: RequestStatusFilterProps) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              aria-current={item.active ? "true" : undefined}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                item.active ? "border-charcoal bg-charcoal text-filament" : "border-charcoal/40 bg-white text-charcoal hover:bg-charcoal/5"
              }`}
            >
              {item.label}
              <span className="tabular-nums">{item.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default RequestStatusFilter;
