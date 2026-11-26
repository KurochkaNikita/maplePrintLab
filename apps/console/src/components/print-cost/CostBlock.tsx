"use client";

import { useId, type ReactNode } from "react";
import InfoTip from "@/components/InfoTip";
import { useT } from "@/components/LocaleProvider";

/** "card" stands on its own; "section" is a part of a card that already has a frame. */
export type CostBlockVariant = "card" | "section";

export interface CostBlockProps {
  title: string;
  /** Explanation behind an "i" next to the title. */
  tip?: string;
  variant: CostBlockVariant;
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<CostBlockVariant, string> = {
  card: "rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-6",
  section: "border-t border-line pt-5",
};

/** A titled group of the cost calculator. */
export function CostBlock({ title, tip, variant, className = "", children }: CostBlockProps) {
  const t = useT();
  const titleId = useId();
  const Heading = variant === "card" ? "h2" : "h4";

  return (
    <div role="group" aria-labelledby={titleId} className={`min-w-0 ${variantClasses[variant]} ${className}`.trim()}>
      <div className="mb-3 flex items-center gap-1">
        <Heading id={titleId} className="font-display text-lg font-semibold text-charcoal">
          {title}
        </Heading>
        {tip && <InfoTip text={tip} label={t.a11y.hint} />}
      </div>
      {children}
    </div>
  );
}

export default CostBlock;
