"use client";

import type { ReactNode } from "react";
import InfoTip from "@/components/InfoTip";
import Label from "@/components/Label";
import { useT } from "@/components/LocaleProvider";

export interface FieldControlProps {
  id: string;
  hasError: boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
}

export interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  /** Help text shown in a tooltip behind an "i" icon after the label. */
  tip?: string;
  error?: string | null;
  className?: string;
  /** Spread the props onto the control so the label, hint and error are wired to it. */
  children: (control: FieldControlProps) => ReactNode;
}

export function Field({ id, label, required, hint, tip, error, className = "", children }: FieldProps) {
  const t = useT();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      {tip ? (
        <div className="mb-1.5 flex items-center gap-1">
          <Label htmlFor={id} requiredIndicator={required} className="!mb-0">
            {label}
          </Label>
          <InfoTip text={tip} label={t.a11y.hint} />
        </div>
      ) : (
        <Label htmlFor={id} requiredIndicator={required}>
          {label}
        </Label>
      )}
      {children({
        id,
        hasError: Boolean(error),
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
      })}
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-ink">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-amber-deep">
          {error}
        </p>
      )}
    </div>
  );
}

export default Field;
