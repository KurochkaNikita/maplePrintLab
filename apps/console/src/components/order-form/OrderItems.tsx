"use client";

import type { ProductSaleOption } from "@maple-print-lab/db";
import Button from "@/components/Button";
import { useT } from "@/components/LocaleProvider";
import type { useOrderForm } from "@/hooks/useOrderForm";
import { fieldId } from "@/lib/finance/types";
import { format } from "@/lib/i18n";
import OrderItemCard from "./OrderItemCard";

export interface OrderItemsProps {
  form: ReturnType<typeof useOrderForm>;
  products: ProductSaleOption[];
  /** Message about the list as a whole, e.g. that it is empty. */
  error?: string;
}

/** The products of the order, one card each, and the button that adds the next one. */
export function OrderItems({ form, products, error }: OrderItemsProps) {
  const t = useT().pages.orders.form.items;
  const { items } = form.values;

  return (
    <section aria-labelledby="of-items-heading" className="space-y-4">
      <h2 id="of-items-heading" className="font-display text-xl font-semibold text-charcoal">
        {format(t.legend, { count: items.length })}
      </h2>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <OrderItemCard
            key={index}
            index={index}
            item={item}
            errors={form.errors}
            products={products}
            collapsed={form.isCollapsed(index)}
            onToggle={form.toggleItem}
            onChange={form.setItem}
            onPickProduct={form.pickProduct}
            onPickCustom={form.pickCustom}
            onPrintChange={form.setPrint}
            onRemove={form.removeItem}
          />
        ))}
      </ul>
      <Button id={fieldId("of", "items")} variant="secondary" className="w-full !border-dashed" onClick={form.addItem}>
        {items.length ? t.addAnother : t.add}
      </Button>
      {error && (
        <p role="alert" className="text-sm font-medium text-amber-deep">
          {error}
        </p>
      )}
    </section>
  );
}

export default OrderItems;
