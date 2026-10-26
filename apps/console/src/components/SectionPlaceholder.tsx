import type { ReactNode } from "react";
import PageHeader from "@/components/PageHeader";
import LayersIcon from "@/icons/layers.svg";

export interface SectionPlaceholderProps {
  title: string;
  description: string;
  emptyTitle: string;
  emptyBody: string;
  icon?: ReactNode;
}

export function SectionPlaceholder({
  title,
  description,
  emptyTitle,
  emptyBody,
  icon,
}: SectionPlaceholderProps) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} />

      <section
        aria-labelledby="placeholder-heading"
        className="rounded-2xl border-2 border-dashed border-charcoal/25 bg-white p-8 text-center shadow-sm sm:p-12"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-amber-deep/30 bg-amber/10 text-amber-deep">
          {icon ?? (
            <LayersIcon className="h-6 w-6" />
          )}
        </div>

        <h2
          id="placeholder-heading"
          className="mt-4 font-display text-lg font-semibold text-charcoal sm:text-xl"
        >
          {emptyTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink sm:text-base">
          {emptyBody}
        </p>
      </section>
    </div>
  );
}

export default SectionPlaceholder;
