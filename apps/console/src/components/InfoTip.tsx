"use client";

import { useId, useState } from "react";
import InfoIcon from "@/icons/info.svg";

export interface InfoTipProps {
  /** The help text shown in the bubble. */
  text: string;
  /** Accessible name of the icon button, e.g. "Hint". */
  label: string;
}

/**
 * Small "i" button that shows `text` on hover and on keyboard focus (so a tap on touch screens works too).
 * The bubble stays in the DOM and is the button's description; Escape dismisses it.
 */
export function InfoTip({ text, label }: InfoTipProps) {
  const id = useId();
  const [dismissed, setDismissed] = useState(false);

  return (
    <span className="group relative inline-flex" onMouseLeave={() => setDismissed(false)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={id}
        onBlur={() => setDismissed(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setDismissed(true);
        }}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-charcoal/10"
      >
        <InfoIcon className="h-4 w-4" />
      </button>
      {/* pt-2 (not margin) keeps the pointer inside the group while moving onto the bubble. */}
      <span
        id={id}
        role="tooltip"
        className={`absolute bottom-full left-0 z-30 w-64 pb-2 transition-opacity ${
          dismissed ? "invisible opacity-0" : "invisible opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
        }`}
      >
        <span className="block rounded-lg bg-charcoal px-3 py-2 text-xs font-medium leading-relaxed text-filament shadow-lg">
          {text}
        </span>
      </span>
    </span>
  );
}

export default InfoTip;
