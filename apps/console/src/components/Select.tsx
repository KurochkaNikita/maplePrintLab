import { forwardRef, type SelectHTMLAttributes } from "react";
import ChevronDownIcon from "@/icons/chevron-down.svg";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { hasError = false, className = "", children, ...props },
  ref
) {
  const borderClass = hasError
    ? "border-2 border-amber-deep bg-amber/5"
    : "border border-ink/60 bg-white hover:border-charcoal";

  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={hasError || undefined}
        className={`min-h-12 w-full appearance-none rounded-lg py-2.5 pl-3.5 pr-11 text-base text-charcoal transition-colors disabled:cursor-not-allowed disabled:bg-filament disabled:text-ink/80 ${borderClass} ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal" />
    </div>
  );
});

export default Select;
