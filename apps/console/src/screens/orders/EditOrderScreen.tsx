import type { FinanceOption, OrderRecord, ProductSaleOption } from "@maple-print-lab/db";
import BackLink from "@/components/BackLink";
import ConfirmDelete from "@/components/ConfirmDelete";
import OrderForm from "@/components/order-form/OrderForm";
import PageHeader from "@/components/PageHeader";
import { deleteOrder } from "@/lib/finance/actions";
import { formatDate } from "@/lib/finance/format";
import { toOrderFormValues } from "@/lib/finance/form-values";
import { format, type Dictionary, type Locale } from "@/lib/i18n";

export interface EditOrderScreenProps {
  t: Dictionary;
  locale: Locale;
  order: OrderRecord;
  channels: FinanceOption[];
  products: ProductSaleOption[];
  justCreated: boolean;
}

export function EditOrderScreen({ t, locale, order, channels, products, justCreated }: EditOrderScreenProps) {
  const p = t.pages.orders;
  const date = formatDate(order.orderedOn, locale);

  return (
    <div className="space-y-6">
      <BackLink href="/orders">{p.backToList}</BackLink>
      <PageHeader title={format(p.edit.heading, { date })} description={p.edit.description} />
      <OrderForm
        target={{ mode: "edit", orderId: order.id }}
        initialValues={toOrderFormValues(order)}
        channels={channels}
        products={products}
        justCreated={justCreated}
        actions={
          <ConfirmDelete
            labels={{ ...p.delete, title: format(p.delete.title, { date }) }}
            errors={t.pages.finance.formErrors}
            action={deleteOrder.bind(null, order.id)}
            redirectTo="/orders"
          />
        }
      />
    </div>
  );
}

export default EditOrderScreen;
