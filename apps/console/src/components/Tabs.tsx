"use client";

import { useRef, type KeyboardEvent } from "react";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  /** Number of invalid fields inside the panel. */
  errorCount?: number;
  /** Spoken after the label when `errorCount` is set, e.g. "errors: 2". */
  errorLabel?: string;
}

export const tabButtonId = (prefix: string, id: string) => `${prefix}-tab-${id}`;
export const tabPanelId = (prefix: string, id: string) => `${prefix}-panel-${id}`;

export interface TabsProps<T extends string> {
  idPrefix: string;
  label: string;
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  /** "underline" for the main sections; "folder" for a nested switch attached to the card below it. */
  variant?: "underline" | "folder";
}

/**
 * ARIA tab list with arrow-key navigation. Panels are rendered by the caller with
 * `role="tabpanel"`, `id={tabPanelId(...)}` and `aria-labelledby={tabButtonId(...)}`;
 * keep inactive panels mounted (`hidden`) so form state survives tab switches.
 */
export function Tabs<T extends string>({ idPrefix, label, tabs, active, onChange, variant = "underline" }: TabsProps<T>) {
  const buttons = useRef<Partial<Record<T, HTMLButtonElement | null>>>({});

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    const target = tabs[next].id;
    onChange(target);
    buttons.current[target]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={
        variant === "folder"
          ? "flex flex-wrap gap-1"
          : "-mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0"
      }
    >
      {tabs.map((tab, index) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              buttons.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={tabButtonId(idPrefix, tab.id)}
            aria-selected={selected}
            aria-controls={tabPanelId(idPrefix, tab.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`relative inline-flex min-h-11 shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              variant === "folder"
                ? `rounded-t-xl border border-b-0 ${
                    selected
                      ? "z-10 -mb-px border-line border-t-4 border-t-amber-deep bg-white text-charcoal"
                      : "border-line bg-filament text-ink hover:bg-white hover:text-charcoal"
                  }`
                : `border-b-4 ${
                    selected
                      ? "border-amber-deep text-charcoal"
                      : "border-transparent text-ink hover:bg-charcoal/5 hover:text-charcoal"
                  }`
            }`}
          >
            {tab.label}
            {tab.errorCount ? (
              <>
                <span
                  aria-hidden="true"
                  className="inline-flex min-w-5 items-center justify-center rounded-full bg-amber-deep px-1.5 py-0.5 font-mono text-[11px] font-semibold leading-none text-filament"
                >
                  {tab.errorCount}
                </span>
                <span className="visually-hidden">{tab.errorLabel}</span>
              </>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
