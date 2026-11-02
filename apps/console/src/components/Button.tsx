import { forwardRef, type ButtonHTMLAttributes } from "react";
import SpinnerIcon from "@/icons/spinner.svg";

import { buttonClassName, type ButtonSize, type ButtonVariant } from "@/components/button-class";

export type { ButtonSize, ButtonVariant };

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

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
        className={buttonClassName(variant, size, className)}
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
