"use client";

import { useState } from "react";
import Link from "next/link";
import { useHydrated } from "@/hooks/useCart";
import { addToCart, MAX_QUANTITY } from "@/lib/cart/store";
import { ctaClassName } from "@/lib/cta-class";
import { fill } from "@/lib/order/format";
import { orderApiUrl } from "@/lib/order/config";
import type { OrderLabels } from "@/lib/order/types";

type AddToRequestButtonProps = {
  /** Button text, e.g. "Add to request". */
  label: string;
  slug: string;
  /** Page of the request list. */
  requestHref: string;
  /** Where the link goes without JavaScript (or when the order API is not configured). */
  contactHref: string;
  labels: OrderLabels;
  className?: string;
};

/**
 * Starts as a link to the contact page, so it is useful before (or without) JavaScript, and turns into a button
 * that adds the piece to the request list once the page is hydrated.
 */
export default function AddToRequestButton({ label, slug, requestHref, contactHref, labels, className = "" }: AddToRequestButtonProps) {
  const hydrated = useHydrated();
  const [message, setMessage] = useState("");

  if (!hydrated || !orderApiUrl) {
    return (
      <Link href={contactHref} className={ctaClassName("solid", className)}>
        {label}
      </Link>
    );
  }

  const handleAdd = () => {
    const quantity = addToCart(slug);
    if (quantity === 0) {
      setMessage(labels.errors.tooManyItems);
      return;
    }
    const added = fill(labels.added, { count: quantity });
    setMessage(quantity === MAX_QUANTITY ? `${added} ${fill(labels.addedMax, { max: MAX_QUANTITY })}` : added);
  };

  return (
    <>
      <button type="button" onClick={handleAdd} className={ctaClassName("solid", className)}>
        {label}
      </button>
      {/* Always in the DOM so the announcement is read when the text appears. */}
      <div role="status" className="mt-3 text-center text-sm text-charcoal">
        {message && (
          <>
            <p>{message}</p>
            <Link href={requestHref} className="inline-block py-2 font-medium underline underline-offset-4 hover:text-amber-deep">
              {labels.viewRequest}
            </Link>
          </>
        )}
      </div>
    </>
  );
}
