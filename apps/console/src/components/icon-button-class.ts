export type IconButtonTone = "default" | "danger";
/** `ghost`: no frame (toolbars, rows). `outline`: framed secondary action. `solid`: the main action. */
export type IconButtonVariant = "ghost" | "outline" | "solid";

const variantClasses: Record<IconButtonVariant, Record<IconButtonTone, string>> = {
  ghost: {
    default: "text-charcoal hover:bg-charcoal/10",
    // red-700 is 6.5:1 on white; the icon shape also says "delete".
    danger: "text-red-700 hover:bg-red-50",
  },
  outline: {
    default: "border-2 border-charcoal bg-white text-charcoal hover:bg-charcoal hover:text-filament",
    danger: "border-2 border-red-700 bg-white text-red-700 hover:bg-red-50",
  },
  solid: {
    default: "bg-amber-deep text-filament shadow-sm shadow-amber-deep/20 hover:bg-charcoal",
    danger: "bg-red-700 text-white hover:bg-red-800",
  },
};

/** The look of a 44 px square icon control, shared by `IconButton` (a <button>) and `IconLink` (a link). */
export function iconButtonClassName(variant: IconButtonVariant = "ghost", tone: IconButtonTone = "default", className = ""): string {
  return `inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant][tone]} ${className}`.trim();
}
