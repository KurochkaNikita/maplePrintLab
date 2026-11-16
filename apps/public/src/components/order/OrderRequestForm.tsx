"use client";

import { orderFieldId, type OrderField, type OrderRequestState } from "@/hooks/useOrderRequest";
import type { Locale } from "@/lib/i18n";
import { ctaClassName } from "@/lib/cta-class";
import { fill } from "@/lib/order/format";
import { turnstileSiteKey } from "@/lib/order/config";
import type { OrderLabels } from "@/lib/order/types";
import { orderStatusText } from "@/lib/order/status-text";
import { ORDER_REQUEST_LIMITS } from "@maple-print-lab/db/src/order-request-validation";
import OrderTextField from "./OrderTextField";
import TurnstileWidget from "./TurnstileWidget";

type OrderRequestFormProps = {
  lang: Locale;
  /** State from `useOrderRequest`; it lives in the page so the list of pieces and the form share it. */
  form: OrderRequestState;
  labels: OrderLabels;
  supportEmail: string;
};

const LIMIT_OF: Partial<Record<OrderField, number>> = {
  firstName: ORDER_REQUEST_LIMITS.name,
  lastName: ORDER_REQUEST_LIMITS.name,
  email: ORDER_REQUEST_LIMITS.email,
  message: ORDER_REQUEST_LIMITS.message,
};

/** Contact details and the send button for the request. */
export default function OrderRequestForm({ lang, form: f, labels, supportEmail }: OrderRequestFormProps) {
  const sending = f.status === "sending";

  const fieldError = (field: OrderField) => {
    const code = f.errors[field];
    if (!code) return undefined;
    const text = labels.errors[code as keyof OrderLabels["errors"]] ?? labels.errors.required;
    return fill(text, { max: LIMIT_OF[field] ?? 0 });
  };

  const statusText = orderStatusText({ status: f.status, errors: f.errors, fieldErrorCount: f.fieldErrorCount, labels, supportEmail });

  return (
    <form onSubmit={f.submit} noValidate className="space-y-3">
      <h2 className="font-display text-xl font-semibold text-charcoal">{labels.detailsHeading}</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <OrderTextField id={orderFieldId("firstName")} name="firstName" label={labels.firstName} required autoComplete="given-name" error={fieldError("firstName")} value={f.values.firstName} onChange={(v) => f.setField("firstName", v)} />
        <OrderTextField id={orderFieldId("lastName")} name="lastName" label={labels.lastName} required autoComplete="family-name" error={fieldError("lastName")} value={f.values.lastName} onChange={(v) => f.setField("lastName", v)} />
      </div>
      <OrderTextField id={orderFieldId("email")} name="email" type="email" label={labels.email} required autoComplete="email" error={fieldError("email")} value={f.values.email} onChange={(v) => f.setField("email", v)} />
      <OrderTextField id={orderFieldId("message")} name="message" label={`${labels.message} (${labels.messageOptional})`} hint={labels.messageHint} multiline error={fieldError("message")} value={f.values.message} onChange={(v) => f.setField("message", v)} />

      {/* Honeypot: invisible and unreachable for people; bots fill it in and the server drops the request. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => f.setWebsite(e.target.value)} />
        </label>
      </div>

      {turnstileSiteKey && (
        <div>
          <p className="mb-1 text-sm text-ink">{labels.spamCheck}</p>
          <TurnstileWidget key={f.attempt} siteKey={turnstileSiteKey} language={lang} onToken={f.setToken} />
        </div>
      )}

      <div aria-live="polite" className="text-sm font-medium text-red-700">
        {sending ? <span className="text-charcoal">{statusText}</span> : statusText}
      </div>

      <button type="submit" disabled={sending} className={ctaClassName("solid", "w-full disabled:cursor-wait disabled:opacity-70")}>
        {sending ? labels.sending : labels.submit}
      </button>
    </form>
  );
}
