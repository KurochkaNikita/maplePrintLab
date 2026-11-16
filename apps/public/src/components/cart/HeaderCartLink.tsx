"use client";

import Link from "next/link";
import { useCart, useHydrated } from "@/hooks/useCart";
import { fill } from "@/lib/order/format";

type HeaderCartLinkProps = {
  href: string;
  /** Accessible name with the number of pieces, e.g. "Your request: {count} pieces". */
  label: string;
  className?: string;
};

/** Link to the request page with the number of pieces. Only shown once there is something in the list. */
export default function HeaderCartLink({ href, label, className = "" }: HeaderCartLinkProps) {
  const hydrated = useHydrated();
  const { pieces } = useCart();
  if (!hydrated || pieces === 0) return null;

  return (
    <Link
      href={href}
      aria-label={fill(label, { count: pieces })}
      className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-charcoal/5 hover:text-amber-deep ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 7h12l-1 13H7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-charcoal px-1 font-mono text-[11px] font-semibold text-white">
        {pieces}
      </span>
    </Link>
  );
}
