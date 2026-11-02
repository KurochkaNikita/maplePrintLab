"use client";

import Button from "@/components/Button";

export interface PhotoAddCardProps {
  title: string;
  hint: string;
  /** Text of the button, e.g. "Choose file". */
  label: string;
  busy: boolean;
  /** The required photo: a primary button, with an `id` so a validation error can move focus to it. */
  required?: boolean;
  /** Id of the button, for focusing it on an error. */
  id?: string;
  error?: string;
  onPick: () => void;
}

/** Dashed card with a button that starts adding a photo. Renders an `<li>`. */
export function PhotoAddCard({ title, hint, label, busy, required = false, id, error, onPick }: PhotoAddCardProps) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <li className="flex flex-col items-start justify-center gap-3 rounded-2xl border-2 border-dashed border-charcoal/25 bg-white p-4 sm:p-5">
      <h3 className="font-display text-base font-semibold text-charcoal">{title}</h3>
      <p className="text-sm text-ink">{hint}</p>
      <Button
        id={id}
        variant={required ? "primary" : "secondary"}
        disabled={busy}
        aria-describedby={error ? errorId : undefined}
        onClick={onPick}
      >
        {label}
      </Button>
      {error && (
        <p id={errorId} className="text-sm font-medium text-amber-deep">
          {error}
        </p>
      )}
    </li>
  );
}

export default PhotoAddCard;
