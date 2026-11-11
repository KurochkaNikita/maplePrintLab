import type { ReactNode } from "react";

/** One term/definition pair of a details card. */
export function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-6">
      <dt className="text-sm font-medium text-ink sm:w-56 sm:shrink-0">{label}</dt>
      <dd className="text-sm text-charcoal">{children}</dd>
    </div>
  );
}

export default InfoRow;
