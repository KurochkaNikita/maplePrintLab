import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fill } from "@/lib/order/format";
import type { OrderLabels } from "@/lib/order/types";
import { ctaClassName } from "@/lib/cta-class";

/** How long the confirmation stays before the visitor is taken to the home page. */
const REDIRECT_DELAY_MS = 4000;

type OrderSuccessProps = {
  labels: OrderLabels;
  /** Address the visitor typed, repeated back so a typo is noticed. */
  email: string;
  /** The home page: where the visitor is sent after a few seconds, and where the button goes. */
  homeHref: string;
};

/** Confirmation after the request was saved. Takes focus on mount so screen readers read it, then goes home. */
export default function OrderSuccess({ labels, email, homeHref }: OrderSuccessProps) {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);
  useEffect(() => {
    const timer = window.setTimeout(() => router.push(homeHref), REDIRECT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [router, homeHref]);

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
      <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-semibold text-charcoal outline-none">
        {labels.successTitle}
      </h1>
      <p className="mt-2 text-charcoal">{fill(labels.success, { email })}</p>
      <p className="mt-2 text-sm text-charcoal">{labels.redirecting}</p>
      <Link href={homeHref} className={ctaClassName("solid", "mt-6")}>
        {labels.backHome}
      </Link>
    </div>
  );
}
