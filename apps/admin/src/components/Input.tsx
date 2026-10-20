import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError = false, className = "", ...props },
  ref
) {
  const borderClass = hasError
    ? "border-2 border-amber-deep bg-amber/5"
    : "border border-ink/60 bg-white hover:border-charcoal";

  return (
    <input
      ref={ref}
      aria-invalid={hasError || undefined}
      className={`min-h-12 w-full rounded-lg px-3.5 py-2.5 text-base text-charcoal placeholder:text-ink/80 transition-colors disabled:cursor-not-allowed disabled:bg-filament disabled:text-ink/80 ${borderClass} ${className}`.trim()}
      {...props}
    />
  );
});

export default Input;
