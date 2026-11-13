import Link from "next/link";
import ChevronDownIcon from "@/icons/chevron-down.svg";

export interface SortHeaderLinkProps {
  header: string;
  sort: { href: string; direction: "asc" | "desc" | null; label: string };
}

/** A column header that sorts the table; the arrow shows the direction (the state is also in `aria-sort`). */
export function SortHeaderLink({ header, sort }: SortHeaderLinkProps) {
  return (
    <Link
      href={sort.href}
      scroll={false}
      aria-label={sort.label}
      className="-mx-2 inline-flex min-h-11 items-center gap-1 rounded-md px-2 hover:bg-charcoal/10 hover:text-amber-deep"
    >
      {header}
      <ChevronDownIcon
        className={`h-4 w-4 transition-transform ${sort.direction ? "" : "opacity-40"} ${sort.direction === "asc" ? "rotate-180" : ""}`}
      />
    </Link>
  );
}

export default SortHeaderLink;
