"use client";

import { useState, type KeyboardEvent } from "react";
import { rankOptions } from "@/lib/search/rank-options";

export interface ComboboxOption {
  value: string;
  label: string;
}

/** One row of the open list: a match, or the extra "use something else" row at the end. */
export type ComboboxEntry = { key: string; label: string; pick: () => void; extra: boolean };

export interface UseComboboxOptions {
  options: ComboboxOption[];
  value: string;
  onSelect: (value: string) => void;
  /** Label of the last row; gets what is typed ("" when nothing is). */
  extraLabel: (typed: string) => string;
  onExtra: (typed: string) => void;
}

/** State and keyboard handling of a searchable single choice. */
export function useCombobox({ options, value, onSelect, extraLabel, onExtra }: UseComboboxOptions) {
  const [open, setOpen] = useState(false);
  /** Null until the user types: the input then shows the chosen label and the list shows everything. */
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const close = () => {
    setOpen(false);
    setQuery(null);
    setActive(0);
  };

  const typed = query?.trim() ?? "";
  const matches = rankOptions(options, typed);
  const entry = (key: string, label: string, run: () => void, extra: boolean): ComboboxEntry => ({
    key,
    label,
    extra,
    pick: () => {
      run();
      close();
    },
  });
  const entries = [
    ...matches.map((o) => entry(o.value, o.label, () => onSelect(o.value), false)),
    entry("extra", extraLabel(typed), () => onExtra(typed), true),
  ];
  const activeIndex = Math.min(active, entries.length - 1);

  const search = (text: string) => {
    setQuery(text);
    setActive(0);
    setOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + step + entries.length) % entries.length);
    } else if (e.key === "Enter") {
      e.preventDefault(); // Enter in this field never submits the whole form
      if (open) entries[activeIndex].pick();
      else setOpen(true);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      close();
    }
  };

  const text = query ?? options.find((o) => o.value === value)?.label ?? "";

  return {
    open,
    text,
    entries,
    activeIndex,
    matchCount: matches.length,
    setActive,
    search,
    show: () => setOpen(true),
    close,
    handleKeyDown,
  };
}
