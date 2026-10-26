"use client";

import type { SelectHTMLAttributes } from "react";
import Field, { type FieldProps } from "@/components/Field";
import Select from "@/components/Select";

export interface SelectFieldProps
  extends Omit<FieldProps, "children">,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "onChange" | "className"> {
  /** Receives the chosen value, not the event. */
  onChange: (value: string) => void;
}

/** Label, hint, error and select wired together; `<option>`s are the children, `className` goes to the wrapper. */
export function SelectField({
  id,
  label,
  required,
  hint,
  tip,
  error,
  className,
  onChange,
  children,
  ...select
}: SelectFieldProps) {
  return (
    <Field id={id} label={label} required={required} hint={hint} tip={tip} error={error} className={className}>
      {(control) => (
        <Select {...control} {...select} onChange={(e) => onChange(e.target.value)}>
          {children}
        </Select>
      )}
    </Field>
  );
}

export default SelectField;
