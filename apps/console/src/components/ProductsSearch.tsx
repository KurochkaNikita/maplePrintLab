"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import CloseIcon from "@/icons/close.svg";
import SearchIcon from "@/icons/search.svg";

const DEBOUNCE_MS = 300;

export interface ProductsSearchProps {
  /** The `q` currently applied by the server. */
  initialQuery: string;
  label: string;
  clearLabel: string;
}

/** Live search: the URL (`?q=`) is updated shortly after typing stops, and the server re-renders the table. */
export function ProductsSearch({ initialQuery, label, clearLabel }: ProductsSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  // Follow the URL when it changes elsewhere (browser back/forward), but never while the user is typing.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setValue(initialQuery);
  }, [initialQuery]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function apply(next: string) {
    clearTimeout(timer.current);
    const q = next.trim();
    // A new search always starts from the first page.
    startTransition(() => router.replace(q ? `/products?q=${encodeURIComponent(q)}` : "/products", { scroll: false }));
  }

  function handleChange(next: string) {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => apply(next), DEBOUNCE_MS);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault(); // Enter applies immediately
    apply(value);
  }

  return (
    <form role="search" onSubmit={handleSubmit}>
      <label htmlFor="products-search" className="visually-hidden">
        {label}
      </label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal" />
        <Input
          ref={inputRef}
          id="products-search"
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder={label}
          value={value}
          aria-busy={pending || undefined}
          onChange={(e) => handleChange(e.target.value)}
          className="pl-11 pr-12"
        />
        {value && (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={() => {
              setValue("");
              apply("");
              inputRef.current?.focus();
            }}
            className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-charcoal transition-colors hover:bg-charcoal/10"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductsSearch;
