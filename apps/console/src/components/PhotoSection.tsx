import type { ReactNode } from "react";

export interface PhotoSectionProps {
  /** Id of the heading, which names the section for screen readers. */
  headingId: string;
  title: string;
  /** Marks the section as required (visual asterisk; the fields carry `aria-required`). */
  required?: boolean;
  hint: string;
  children: ReactNode;
}

/** A titled group of photo cards with a short explanation under the heading. */
export function PhotoSection({ headingId, title, required = false, hint, children }: PhotoSectionProps) {
  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <div>
        <h2 id={headingId} className="font-display text-lg font-semibold text-charcoal">
          {title}
          {required && (
            <span aria-hidden="true" className="ml-1 text-amber-deep">
              *
            </span>
          )}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-ink">{hint}</p>
      </div>
      {children}
    </section>
  );
}

export default PhotoSection;
