import { useId, type InputHTMLAttributes } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  label: string;
  hint?: string;
}

/**
 * An on/off switch on a native checkbox (`role="switch"`), so keyboard and screen readers work as usual.
 * The state is also shown by the knob position, not by colour alone. The whole row is a ≥ 44 px target.
 */
export function Switch({ label, hint, className = "", ...props }: SwitchProps) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const hintId = `${uid}-hint`;

  return (
    <label className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-lg py-2 ${className}`.trim()}>
      <span className="relative mt-px inline-flex h-6 w-11 shrink-0">
        <input
          type="checkbox"
          role="switch"
          aria-labelledby={labelId}
          aria-describedby={hint ? hintId : undefined}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...props}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-gray-500 transition-colors motion-reduce:transition-none peer-checked:bg-amber-deep peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-charcoal peer-disabled:opacity-50"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform motion-reduce:transition-none peer-checked:translate-x-5"
        />
      </span>
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

export default Switch;
