import { useId } from "react";

export interface EmptyStateProps {
  title: string;
  body: string;
}

/** Dashed card shown instead of a list that has nothing to show yet. */
export function EmptyState({ title, body }: EmptyStateProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-2xl border-2 border-dashed border-charcoal/25 bg-white p-8 text-center shadow-sm sm:p-12"
    >
      <h2 id={headingId} className="font-display text-lg font-semibold text-charcoal sm:text-xl">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink sm:text-base">{body}</p>
    </section>
  );
}

export default EmptyState;
