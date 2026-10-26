"use client";

import type { TextareaHTMLAttributes } from "react";
import Field, { type FieldProps } from "@/components/Field";
import Textarea from "@/components/Textarea";

export interface TextareaFieldProps
  extends Omit<FieldProps, "children">,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "onChange" | "className"> {
  /** Receives the new text, not the event. */
  onChange: (value: string) => void;
}

/** Label, hint, error and textarea wired together; extra props go to the `<textarea>`, `className` to the wrapper. */
export function TextareaField({
  id,
  label,
  required,
  hint,
  tip,
  error,
  className,
  onChange,
  ...textarea
}: TextareaFieldProps) {
  return (
    <Field id={id} label={label} required={required} hint={hint} tip={tip} error={error} className={className}>
      {(control) => <Textarea {...control} {...textarea} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

export default TextareaField;
