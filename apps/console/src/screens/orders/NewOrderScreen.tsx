import type { FinanceOption, OrderRequestRecord, ProductSaleOption } from "@maple-print-lab/db";
import BackLink from "@/components/BackLink";
import OrderForm from "@/components/order-form/OrderForm";
import PageHeader from "@/components/PageHeader";
import { emptyOrderValues } from "@/lib/finance/form-values";
import { format, type Dictionary } from "@/lib/i18n";
import { orderValuesFromRequest } from "@/lib/order-requests/prefill";

export interface NewOrderScreenProps {
  t: Dictionary;
  channels: FinanceOption[];
  products: ProductSaleOption[];
  /** Today (YYYY-MM-DD) in the shop's time zone, prefilled as the order date. */
  today: string;
  /** Customer request this order is created from: prefills the form and links the order back to it. */
  request?: OrderRequestRecord;
}

export function NewOrderScreen({ t, channels, products, today, request }: NewOrderScreenProps) {
  const p = t.pages.orders;

  return (
    <div className="space-y-6">
      {request ? (
        <BackLink href={`/requests/${request.id}`}>{t.pages.requests.fromRequest.backToRequest}</BackLink>
      ) : (
        <BackLink href="/orders">{p.backToList}</BackLink>
      )}
      <PageHeader title={p.new.heading} description={p.new.description} />
      {request && (
        <p className="rounded-xl border border-line bg-white p-4 text-sm text-charcoal shadow-sm">
          {format(t.pages.requests.fromRequest.note, { name: `${request.firstName} ${request.lastName}`, email: request.email })}
        </p>
      )}
      <OrderForm
        target={request ? { mode: "create", requestId: request.id } : { mode: "create" }}
        initialValues={request ? orderValuesFromRequest(request, products, today) : emptyOrderValues(today)}
        channels={channels}
        products={products}
      />
    </div>
  );
}

export default NewOrderScreen;
