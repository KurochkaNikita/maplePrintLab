import type { ComponentProps, ComponentType, SVGProps } from "react";
import Link from "next/link";
import { iconButtonClassName, type IconButtonTone, type IconButtonVariant } from "@/components/icon-button-class";

export interface IconLinkProps extends Omit<ComponentProps<typeof Link>, "children" | "aria-label"> {
  /** The icon, an SVG component from `src/icons`. */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Accessible name and tooltip. For a link that opens a new tab, say so here. */
  label: string;
  tone?: IconButtonTone;
  variant?: IconButtonVariant;
}

/** A link that looks like an `IconButton`: for navigation, where a <button> would be the wrong element. */
export function IconLink({ icon: Icon, label, tone = "default", variant = "ghost", className = "", ...props }: IconLinkProps) {
  return (
    <Link aria-label={label} title={label} className={iconButtonClassName(variant, tone, className)} {...props}>
      <Icon className="h-5 w-5" />
    </Link>
  );
}

export default IconLink;
