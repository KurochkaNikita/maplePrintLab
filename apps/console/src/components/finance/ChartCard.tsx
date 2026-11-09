import type { ReactNode } from "react";

export interface ChartCardProps {
  /** DOM id of the heading; the section is labelled by it. */
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}

/** A card with a heading, a short description and a chart. */
export function ChartCard({ id, title, description, children }: ChartCardProps) {
  return (
    <section aria-labelledby={id} className="min-w-0 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-6">
      <h2 id={id} className="font-display text-xl font-semibold text-charcoal">
        {title}
      </h2>
      <p className="mt-1 text-sm text-ink">{description}</p>
      {children}
    </section>
  );
}

export default ChartCard;
