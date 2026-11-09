import type { ReactNode } from "react";

export interface BreakdownCardProps {
  title: string;
  /** Shown instead of the children when there is nothing to list. */
  emptyText: string;
  isEmpty: boolean;
  children: ReactNode;
}

/** A titled card holding a small table, or a note when there is no data. */
export function BreakdownCard({ title, emptyText, isEmpty, children }: BreakdownCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <h2 className="border-b border-line px-4 py-3 font-display text-lg font-semibold text-charcoal">{title}</h2>
      {isEmpty ? <p className="px-4 py-4 text-sm text-ink">{emptyText}</p> : children}
    </section>
  );
}

export default BreakdownCard;
