import { useId } from "react";

type OrderTextFieldProps = {
  id: string;
  name: string;
  label: string;
  /** Small grey-free hint under the label, e.g. what to write in a comment. */
  hint?: string;
  /** Marks the field required (asterisk; the rule itself is checked in validation). */
  required?: boolean;
  /** Text of the error, already translated. */
  error?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
  autoComplete?: string;
  /** Renders a textarea instead of an input. */
  multiline?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
};

const control =
  "mt-1 block min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-base text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal";

/** Label, optional hint, control and error text wired together with `aria-describedby` / `aria-invalid`. */
export default function OrderTextField({
  id,
  name,
  label,
  hint,
  required,
  error,
  value,
  onChange,
  type = "text",
  autoComplete,
  multiline,
  autoFocus,
  maxLength,
}: OrderTextFieldProps) {
  const hintId = useId();
  const errorId = useId();
  const describedBy = [hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined;
  const props = {
    id,
    name,
    value,
    required,
    autoFocus,
    maxLength,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `${control} ${error ? "border-red-700" : "border-charcoal/60"}`,
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-charcoal">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && (
        <p id={hintId} className="mt-0.5 text-sm text-ink">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea {...props} rows={3} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...props} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
