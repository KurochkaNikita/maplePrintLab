import Link from "next/link";
import type { OrderRequestRecord } from "@maple-print-lab/db";
import BackLink from "@/components/BackLink";
import ButtonLink from "@/components/ButtonLink";
import { buttonClassName } from "@/components/button-class";
import InfoRow from "@/components/product-view/InfoRow";
import PageHeader from "@/components/PageHeader";
import RequestItemsTable from "@/components/requests/RequestItemsTable";
import RequestStatusBadge from "@/components/requests/RequestStatusBadge";
import RequestStatusForm from "@/components/requests/RequestStatusForm";
import { format, type Dictionary, type Locale } from "@/lib/i18n";

export interface RequestScreenProps {
  t: Dictionary;
  locale: Locale;
  request: OrderRequestRecord;
}

const INTL_LOCALE: Record<Locale, string> = { ru: "ru-CA", en: "en-CA", fr: "fr-CA" };

export function RequestScreen({ t, locale, request }: RequestScreenProps) {
  const p = t.pages.requests;
  const d = p.detail;
  const name = `${request.firstName} ${request.lastName}`;
  const received = new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "long", timeStyle: "short", timeZone: "America/Vancouver" }).format(request.createdAt);
  const mailto = `mailto:${request.email}?subject=${encodeURIComponent(format(d.replySubject, { product: request.items[0]?.productTitle ?? "" }))}`;

  return (
    <div className="space-y-6">
      <BackLink href="/requests">{p.backToList}</BackLink>
      <PageHeader
        title={format(d.heading, { name })}
        actions={
          <>
            {/* A plain <a>: mailto: is handed to the mail program by the browser, not routed by Next. */}
            <a href={mailto} className={buttonClassName("secondary")}>
              {d.reply}
            </a>
            {request.orderId ? (
              <ButtonLink href={`/orders/${request.orderId}`}>{d.viewOrder}</ButtonLink>
            ) : (
              <ButtonLink href={`/orders/new?fromRequest=${request.id}`}>{d.createOrder}</ButtonLink>
            )}
          </>
        }
      />

      <dl className="divide-y divide-line rounded-2xl border border-line bg-white px-4 shadow-sm sm:px-6">
        <InfoRow label={d.fields.status}>
          <RequestStatusBadge status={request.status} label={p.status[request.status]} />
        </InfoRow>
        <InfoRow label={d.fields.date}>{received}</InfoRow>
        <InfoRow label={d.fields.name}>{name}</InfoRow>
        <InfoRow label={d.fields.email}>
          <a href={mailto} className="inline-block py-1 break-all text-charcoal underline underline-offset-4">
            {request.email}
          </a>
        </InfoRow>
        <InfoRow label={d.fields.locale}>{d.localeNames[request.locale]}</InfoRow>
        <InfoRow label={d.fields.message}>
          {request.message ? <span className="whitespace-pre-wrap break-words">{request.message}</span> : <span className="text-ink">{d.noMessage}</span>}
        </InfoRow>
        {request.orderId && (
          <InfoRow label={d.fields.order}>
            <Link href={`/orders/${request.orderId}`} className="inline-block py-1 underline underline-offset-4">
              {d.viewOrder}
            </Link>
          </InfoRow>
        )}
      </dl>

      <section aria-labelledby="request-items-heading" className="space-y-3">
        <h2 id="request-items-heading" className="font-display text-lg font-semibold text-charcoal">
          {d.fields.items}
        </h2>
        <RequestItemsTable items={request.items} locale={locale} labels={d} />
      </section>

      <section className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-6">
        <RequestStatusForm key={request.status} requestId={request.id} status={request.status} />
      </section>
    </div>
  );
}

export default RequestScreen;
