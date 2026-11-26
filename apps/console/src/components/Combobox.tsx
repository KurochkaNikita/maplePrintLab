"use client";

import { useId } from "react";
import type { FieldControlProps } from "@/components/Field";
import Input from "@/components/Input";
import { useCombobox, type UseComboboxOptions } from "@/hooks/useCombobox";
import SearchIcon from "@/icons/search.svg";
import ComboboxOptionRow from "./ComboboxOptionRow";

export type ComboboxProps = UseComboboxOptions &
  FieldControlProps & {
    placeholder: string;
    /** Shown above the list when nothing is similar to the typed text. */
    noMatchText: string;
    /** Announced to screen readers while searching. */
    countText: (count: number) => string;
  };

/** A text field that suggests similar options while typing (ARIA combobox + listbox). Use it inside `Field`. */
export function Combobox({ id, hasError, placeholder, noMatchText, countText, ...props }: ComboboxProps) {
  const listId = `${useId()}-list`;
  const { options, value, onSelect, extraLabel, onExtra, ...control } = props;
  const box = useCombobox({ options, value, onSelect, extraLabel, onExtra });
  const optionId = (i: number) => `${listId}-${i}`;

  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-3.5 top-6 h-5 w-5 -translate-y-1/2 text-charcoal" />
      <Input
        {...control}
        id={id}
        hasError={hasError}
        type="text"
        role="combobox"
        aria-expanded={box.open}
        aria-controls={box.open ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={box.open ? optionId(box.activeIndex) : undefined}
        autoComplete="off"
        placeholder={placeholder}
        className="!pl-11"
        value={box.text}
        onChange={(e) => box.search(e.target.value)}
        // Selecting the shown name lets the next keystroke start a new search.
        onFocus={(e) => e.target.select()}
        onClick={box.show}
        onBlur={box.close}
        onKeyDown={box.handleKeyDown}
      />
      {box.open && (
        <div
          // Keeps focus in the input while the list or its scrollbar is pressed.
          onMouseDown={(e) => e.preventDefault()}
          className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-charcoal/30 bg-white py-1 shadow-lg"
        >
          {box.matchCount === 0 && <p className="px-3.5 py-2 text-sm text-ink">{noMatchText}</p>}
          <ul id={listId} role="listbox" aria-label={placeholder}>
            {box.entries.map((entry, i) => (
              <ComboboxOptionRow
                key={entry.key}
                id={optionId(i)}
                entry={entry}
                active={i === box.activeIndex}
                onHover={() => box.setActive(i)}
              />
            ))}
          </ul>
        </div>
      )}
      <p role="status" className="visually-hidden">
        {box.open ? countText(box.matchCount) : ""}
      </p>
    </div>
  );
}

export default Combobox;
