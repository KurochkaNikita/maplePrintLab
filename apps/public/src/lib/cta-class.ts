export type CtaVariant = "solid" | "outline";

/** Look of the call-to-action pill, shared by the link (`CtaLink`) and the button that opens the order dialog. */
export function ctaClassName(variant: CtaVariant = "solid", className = ""): string {
  const base =
    "inline-flex items-center justify-center min-h-11 rounded-full px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider transition-all hover:-translate-y-0.5";
  const styles =
    variant === "solid"
      ? "bg-amber-deep text-filament shadow-sm shadow-amber-deep/30 hover:bg-charcoal hover:shadow-md"
      : "border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-filament";

  return `${base} ${styles} ${className}`.trim();
}
