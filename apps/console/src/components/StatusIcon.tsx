import type { ComponentType, SVGProps } from "react";

export interface StatusIconProps {
  /** An icon from `src/icons` (imported as a React component). */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  /** Border, background and text colour of the round badge. */
  className: string;
}

/**
 * Small round icon with a hover tooltip; the text is also read by screen readers.
 * `z-10` keeps it above the row's stretched link so it can be hovered.
 */
export function StatusIcon({ icon: Icon, label, className }: StatusIconProps) {
  return (
    <span className="group relative z-10 inline-flex">
      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${className}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="visually-hidden">{label}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-charcoal px-2 py-1 text-xs font-medium text-filament opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

export default StatusIcon;
