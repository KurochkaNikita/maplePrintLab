import type { ButtonHTMLAttributes, ComponentType, SVGProps } from "react";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  /** The icon, an SVG component from `src/icons`. */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Accessible name and tooltip: an icon alone says nothing to a screen reader. */
  label: string;
  /** `danger` is red, for destructive actions (red-700 is 6.5:1 on white; the icon shape also says "delete"). */
  tone?: "default" | "danger";
}

const TONE_CLASS = {
  default: "text-charcoal hover:bg-charcoal/10",
  danger: "text-red-700 hover:bg-red-50",
} as const;

/** A 44 px square button with only an icon; its `label` is the name and the tooltip. */
export function IconButton({ icon: Icon, label, tone = "default", className = "", type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${TONE_CLASS[tone]} disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
      {...props}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

export default IconButton;
