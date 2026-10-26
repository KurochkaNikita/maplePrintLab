import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { hasError = false, className = "", rows = 4, ...props },
  ref
) {
  const borderClass = hasError
    ? "border-2 border-amber-deep bg-amber/5"
    : "border border-ink/60 bg-white hover:border-charcoal";

  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={hasError || undefined}
      className={`w-full resize-y rounded-lg px-3.5 py-2.5 text-base text-charcoal placeholder:text-ink/80 transition-colors disabled:cursor-not-allowed disabled:bg-filament disabled:text-ink/80 ${borderClass} ${className}`.trim()}
      {...props}
    />
  );
});

export default Textarea;
