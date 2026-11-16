import Link from "next/link";
import { ctaClassName, type CtaVariant } from "@/lib/cta-class";

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: CtaVariant;
  className?: string;
};

export default function CtaLink({
  href,
  children,
  variant = "solid",
  className = "",
}: CtaLinkProps) {
  return (
    <Link href={href} className={ctaClassName(variant, className)}>
      {children}
    </Link>
  );
}
