"use client";

import type { InputHTMLAttributes } from "react";
import Field, { type FieldProps } from "@/components/Field";
import Input from "@/components/Input";

export interface InputFieldProps
  extends Omit<FieldProps, "children">,
    Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "onChange" | "className"> {
  /** Receives the new text, not the event. */
  onChange: (value: string) => void;
}

/** Label, hint, error and input wired together; extra props go to the `<input>`, `className` to the wrapper. */
export function InputField({ id, label, required, hint, tip, error, className, onChange, ...input }: InputFieldProps) {
  return (
    <Field id={id} label={label} required={required} hint={hint} tip={tip} error={error} className={className}>
      {(control) => <Input {...control} {...input} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

export default InputField;
