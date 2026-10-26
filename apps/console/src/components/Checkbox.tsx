import { useId, type InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
}

/** The whole row is the click target (≥ 44 px tall); the hint is a description, not part of the name. */
export function Checkbox({ label, hint, className = "", ...props }: CheckboxProps) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const hintId = `${uid}-hint`;

  return (
    <label className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-lg py-2 ${className}`.trim()}>
      <input
        type="checkbox"
        aria-labelledby={labelId}
        aria-describedby={hint ? hintId : undefined}
        className="mt-px h-6 w-6 shrink-0 cursor-pointer accent-amber-deep disabled:cursor-not-allowed"
        {...props}
      />
      <span className="min-w-0">
        <span id={labelId} className="block text-sm font-medium text-charcoal">
          {label}
        </span>
        {hint && (
          <span id={hintId} className="mt-0.5 block text-sm text-ink">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

export default Checkbox;
