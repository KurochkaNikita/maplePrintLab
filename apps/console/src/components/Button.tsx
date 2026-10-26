import { forwardRef, type ButtonHTMLAttributes } from "react";
import SpinnerIcon from "@/icons/spinner.svg";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-amber-deep text-filament shadow-sm shadow-amber-deep/20 hover:bg-charcoal disabled:bg-charcoal/50 disabled:text-filament disabled:shadow-none",
  secondary:
    "border-2 border-charcoal bg-white text-charcoal hover:bg-charcoal hover:text-filament disabled:border-charcoal/40 disabled:bg-filament disabled:text-charcoal/60",
  ghost:
    "border border-transparent bg-transparent text-charcoal hover:border-charcoal/20 hover:bg-charcoal/5 disabled:text-charcoal/50",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  sm: "min-h-11 px-3.5 py-2 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className = "",
      children,
      type = "button",
      ...props
    },
    ref
  ) {
    const isDisabled = Boolean(disabled || loading);

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-mono font-medium uppercase tracking-wider transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
        {...props}
      >
        {loading && (
          <SpinnerIcon className="h-4 w-4 animate-spin" />
        )}
        <span>{children}</span>
      </button>
    );
  }
);

export default Button;
