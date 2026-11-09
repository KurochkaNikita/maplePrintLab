import type { FinanceOption, ProductSaleOption } from "@maple-print-lab/db";
import BackLink from "@/components/BackLink";
import OrderForm from "@/components/order-form/OrderForm";
import PageHeader from "@/components/PageHeader";
import { emptyOrderValues } from "@/lib/finance/form-values";
import type { Dictionary } from "@/lib/i18n";

export interface NewOrderScreenProps {
  t: Dictionary;
  channels: FinanceOption[];
  products: ProductSaleOption[];
  /** Today (YYYY-MM-DD) in the shop's time zone, prefilled as the order date. */
  today: string;
}

export function NewOrderScreen({ t, channels, products, today }: NewOrderScreenProps) {
  const p = t.pages.orders;

  return (
    <div className="space-y-6">
      <BackLink href="/orders">{p.backToList}</BackLink>
      <PageHeader title={p.new.heading} description={p.new.description} />
      <OrderForm target={{ mode: "create" }} initialValues={emptyOrderValues(today)} channels={channels} products={products} />
    </div>
  );
}

export default NewOrderScreen;
