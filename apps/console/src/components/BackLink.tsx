import type { ReactNode } from "react";
import Link from "next/link";

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center text-sm font-medium text-charcoal underline-offset-4 hover:underline"
    >
      <span aria-hidden="true" className="mr-1.5">
        ←
      </span>
      {children}
    </Link>
  );
}

export default BackLink;
