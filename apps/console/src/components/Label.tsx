import { forwardRef, type LabelHTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  requiredIndicator?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { requiredIndicator = false, className = "", children, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      className={`mb-1.5 inline-block text-sm font-medium text-charcoal ${className}`.trim()}
      {...props}
    >
      {children}
      {requiredIndicator && (
        <span aria-hidden="true" className="ml-1 font-semibold text-amber-deep">
          *
        </span>
      )}
    </label>
  );
});

export default Label;
