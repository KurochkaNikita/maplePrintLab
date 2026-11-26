"use client";

import { useEffect, useRef } from "react";
import type { ComboboxEntry } from "@/hooks/useCombobox";

export interface ComboboxOptionRowProps {
  id: string;
  entry: ComboboxEntry;
  active: boolean;
  onHover: () => void;
}

/** One row of the `Combobox` list; the active one is kept in view for keyboard users. */
export function ComboboxOptionRow({ id, entry, active, onHover }: ComboboxOptionRowProps) {
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <li
      ref={ref}
      id={id}
      role="option"
      aria-selected={active}
      onClick={entry.pick}
      onMouseMove={onHover}
      className={`flex min-h-11 cursor-pointer items-center px-3.5 py-2 text-sm text-charcoal ${active ? "bg-charcoal/10" : ""} ${
        entry.extra ? "border-t border-line font-semibold" : ""
      }`.trim()}
    >
      {entry.label}
    </li>
  );
}

export default ComboboxOptionRow;
