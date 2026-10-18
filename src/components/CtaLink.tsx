import Link from "next/link";

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
};

export default function CtaLink({
  href,
  children,
  variant = "solid",
}: CtaLinkProps) {
  const base =
    "inline-flex items-center justify-center min-h-11 rounded-full px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider transition-all hover:-translate-y-0.5";
  const styles =
    variant === "solid"
      ? "bg-amber-deep text-filament shadow-sm shadow-amber-deep/30 hover:bg-charcoal hover:shadow-md"
      : "border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-filament";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
