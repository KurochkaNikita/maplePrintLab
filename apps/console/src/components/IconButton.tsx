import type { ButtonHTMLAttributes, ComponentType, SVGProps } from "react";
import { iconButtonClassName, type IconButtonTone, type IconButtonVariant } from "@/components/icon-button-class";
import SpinnerIcon from "@/icons/spinner.svg";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  /** The icon, an SVG component from `src/icons`. */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Accessible name and tooltip: an icon alone says nothing to a screen reader. */
  label: string;
  /** `danger` is red, for destructive actions. */
  tone?: IconButtonTone;
  variant?: IconButtonVariant;
  /** Shows a spinner instead of the icon and disables the button. */
  loading?: boolean;
}

/** A 44 px square button with only an icon; its `label` is the name and the tooltip. */
export function IconButton({
  icon: Icon,
  label,
  tone = "default",
  variant = "ghost",
  loading = false,
  disabled,
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={iconButtonClassName(variant, tone, className)}
      {...props}
    >
      {loading ? <SpinnerIcon className="h-5 w-5 animate-spin motion-reduce:animate-none" /> : <Icon className="h-5 w-5" />}
    </button>
  );
}

export default IconButton;
