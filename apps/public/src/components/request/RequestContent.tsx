"use client";

import { useRef, useState } from "react";
import { useCart, useHydrated } from "@/hooks/useCart";
import { useOrderRequest } from "@/hooks/useOrderRequest";
import { removeFromCart, setCartQuantity } from "@/lib/cart/store";
import type { Locale } from "@/lib/i18n";
import { fill } from "@/lib/order/format";
import type { CartCatalogEntry, OrderLabels } from "@/lib/order/types";
import OrderRequestForm from "@/components/order/OrderRequestForm";
import OrderSuccess from "@/components/order/OrderSuccess";
import EmptyRequest from "./EmptyRequest";
import RequestLine from "./RequestLine";

type RequestContentProps = {
  lang: Locale;
  labels: OrderLabels;
  /** Every piece that can be requested, so lines can show a name, a photo and a price. */
  catalog: CartCatalogEntry[];
  supportEmail: string;
  productsHref: string;
  homeHref: string;
  /** Page title, shown above the list and the form (the confirmation has its own). */
  heading: string;
  /** Shown under the title; the no-JavaScript fallback. */
  children?: React.ReactNode;
};

/** The request page: the chosen pieces with quantities, and the form to send them. Client-only, because the list lives in the browser. */
export default function RequestContent({ lang, labels, catalog, supportEmail, productsHref, homeHref, heading, children }: RequestContentProps) {
  const hydrated = useHydrated();
  const { lines } = useCart();
  const form = useOrderRequest({ lines, lang });
  const [announcement, setAnnouncement] = useState("");
  const regionRef = useRef<HTMLDivElement>(null);

  const titleOf = (slug: string) => catalog.find((entry) => entry.slug === slug)?.title ?? slug;

  const handleQuantity = (slug: string, quantity: number) => {
    setCartQuantity(slug, quantity);
    form.clearItemsFeedback();
    setAnnouncement(fill(labels.line.quantityChanged, { title: titleOf(slug), count: quantity }));
  };

  const handleRemove = (slug: string) => {
    removeFromCart(slug);
    form.clearItemsFeedback();
    setAnnouncement(fill(labels.line.removed, { title: titleOf(slug) }));
    // The button that had focus is gone; keep keyboard users in the list.
    regionRef.current?.focus();
  };

  const title = <h1 className="font-display text-3xl font-semibold text-charcoal">{heading}</h1>;

  if (!hydrated) {
    return (
      <>
        {title}
        <div className="mt-8">{children}</div>
      </>
    );
  }

  if (form.status === "sent") {
    return <OrderSuccess labels={labels} email={form.values.email} homeHref={homeHref} />;
  }

  return (
    <div ref={regionRef} tabIndex={-1} className="outline-none">
      {lines.length > 0 && title}
      <p role="status" className="sr-only">
        {announcement}
      </p>
      <div className={lines.length > 0 ? "mt-8" : undefined}>
        {lines.length === 0 ? (
          <EmptyRequest labels={labels.empty} productsHref={productsHref} />
        ) : (
          <>
            <p className="mb-8 max-w-2xl text-charcoal">{labels.intro}</p>
            <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-start">
              <section aria-labelledby="request-pieces-heading">
                <h2 id="request-pieces-heading" className="font-display text-xl font-semibold text-charcoal">
                  {labels.piecesHeading}
                </h2>
                <ul className="mt-2 divide-y divide-line border-y border-line">
                  {lines.map((line) => (
                    <RequestLine
                      key={line.slug}
                      line={line}
                      entry={catalog.find((entry) => entry.slug === line.slug)}
                      unavailable={form.unavailable.includes(line.slug)}
                      labels={labels.line}
                      onQuantity={handleQuantity}
                      onRemove={handleRemove}
                    />
                  ))}
                </ul>
                <p className="mt-3 text-sm text-charcoal">{labels.priceNote}</p>
              </section>
              <OrderRequestForm lang={lang} form={form} labels={labels} supportEmail={supportEmail} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
