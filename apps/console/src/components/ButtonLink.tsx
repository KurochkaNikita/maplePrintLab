import type { ComponentProps } from "react";
import Link from "next/link";
import { buttonClassName, type ButtonSize, type ButtonVariant } from "@/components/button-class";

export interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** A link that looks like a `Button`: for navigation, where a <button> would be the wrong element. */
export function ButtonLink({ variant = "primary", size = "md", className = "", ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName(variant, size, className)} {...props} />;
}

export default ButtonLink;
