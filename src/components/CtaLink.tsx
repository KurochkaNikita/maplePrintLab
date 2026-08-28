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
    "inline-flex items-center justify-center rounded-md px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors";
  const styles =
    variant === "solid"
      ? "bg-amber text-filament hover:bg-amber-deep"
      : "border border-charcoal text-charcoal hover:bg-charcoal hover:text-filament";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
