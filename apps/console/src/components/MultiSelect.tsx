"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import CheckIcon from "@/icons/check.svg";
import ChevronDownIcon from "@/icons/chevron-down.svg";
import CloseIcon from "@/icons/close.svg";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  id: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  /** Shown instead of the list when there are no options at all. */
  emptyText: string;
  noMatchText: string;
  removeLabel: (label: string) => string;
  hasError?: boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
}

/** Filterable multi-select (ARIA combobox + listbox). The list stays open while picking. */
export function MultiSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
  emptyText,
  noMatchText,
  removeLabel,
  hasError = false,
  "aria-describedby": describedBy,
  "aria-required": required,
}: MultiSelectProps) {
  const listId = `${useId()}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);
  const activeIndex = Math.min(active, Math.max(filtered.length - 1, 0));
  const optionId = (i: number) => `${listId}-${i}`;

  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + step + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      if (open) e.preventDefault(); // do not submit the form while picking
      if (open && filtered[activeIndex]) toggle(filtered[activeIndex].value);
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
      }
    } else if (e.key === "Backspace" && !query && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  const borderClass = hasError
    ? "border-2 border-amber-deep bg-amber/5"
    : "border border-ink/60 bg-white hover:border-charcoal";

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <div
        onClick={() => inputRef.current?.focus()}
        className={`flex min-h-12 cursor-text flex-wrap items-center gap-2 rounded-lg py-1.5 pl-2.5 pr-11 transition-colors ${borderClass}`}
      >
        {value.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-full border border-charcoal/25 bg-filament py-0.5 pl-3 pr-0.5 text-sm font-medium text-charcoal"
          >
            {labelOf(v)}
            <button
              type="button"
              aria-label={removeLabel(labelOf(v))}
              onClick={(e) => {
                e.stopPropagation();
                toggle(v);
                inputRef.current?.focus();
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-charcoal/10"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered.length ? optionId(activeIndex) : undefined}
          aria-describedby={describedBy}
          aria-required={required}
          aria-invalid={hasError || undefined}
          autoComplete="off"
          placeholder={value.length ? "" : placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="min-h-9 min-w-[8rem] flex-1 bg-transparent px-1 text-base text-charcoal placeholder:text-ink/80 focus:outline-none"
        />
      </div>
      <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-6 h-5 w-5 -translate-y-1/2 text-charcoal" />

      {open && (
        <div
          // Keeps focus in the input when the scrollbar or padding is pressed; otherwise the list closes.
          onMouseDown={(e) => e.preventDefault()}
          className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-charcoal/30 bg-white py-1 shadow-lg"
        >
          <ul id={listId} role="listbox" aria-multiselectable="true" aria-label={placeholder}>
            {filtered.map((o, i) => {
              const selected = value.includes(o.value);
              return (
                <li
                  key={o.value}
                  id={optionId(i)}
                  role="option"
                  aria-selected={selected}
                  onClick={() => toggle(o.value)}
                  onMouseMove={() => setActive(i)}
                  className={`flex min-h-11 cursor-pointer items-center gap-3 px-3.5 py-2 text-sm text-charcoal ${
                    i === activeIndex ? "bg-charcoal/10" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      selected ? "border-amber-deep bg-amber-deep text-filament" : "border-ink/60 bg-white"
                    }`}
                  >
                    {selected && (
                      <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
                    )}
                  </span>
                  {o.label}
                </li>
              );
            })}
          </ul>
          {filtered.length === 0 && (
            <p className="px-3.5 py-2 text-sm text-ink">{options.length ? noMatchText : emptyText}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
