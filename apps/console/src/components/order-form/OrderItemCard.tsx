"use client";

import type { ProductSaleOption } from "@maple-print-lab/db";
import InputField from "@/components/InputField";
import { useLocale, useT } from "@/components/LocaleProvider";
import RepeatableItem from "@/components/RepeatableItem";
import SelectField from "@/components/SelectField";
import { errorText } from "@/lib/finance/error-text";
import { formatMoney } from "@/lib/finance/format";
import { lineAmounts } from "@/lib/finance/totals";
import { fieldId, type FieldErrors, type OrderItemValues } from "@/lib/finance/types";
import { format } from "@/lib/i18n";

export interface OrderItemCardProps {
  index: number;
  item: OrderItemValues;
  errors: FieldErrors;
  products: ProductSaleOption[];
  onChange: (index: number, patch: Partial<OrderItemValues>) => void;
  onPickProduct: (index: number, productId: string) => void;
  onRemove: (index: number) => void;
}

/** One order line: a catalogue product or a custom item, its quantity, price and our cost. */
export function OrderItemCard({ index, item, errors, products, onChange, onPickProduct, onRemove }: OrderItemCardProps) {
  const dict = useT();
  const locale = useLocale();
  const t = dict.pages.orders.form.items;
  const n = index + 1;
  const key = (field: string) => `items.${index}.${field}`;
  const id = (field: string) => fieldId("of", key(field));
  const err = (field: string) => errorText(errors, key(field), dict);
  const profit = lineAmounts(item).profit;

  return (
    <RepeatableItem
      id={`of-item-${index}`}
      title={format(t.itemTitle, { n })}
      removeLabel={format(t.remove, { n })}
      onRemove={() => onRemove(index)}
      bodyClassName="sm:grid-cols-6"
    >
      <SelectField
        id={id("productId")}
        label={t.productLabel}
        hint={t.productHint}
        error={err("productId")}
        className="sm:col-span-6"
        value={item.productId}
        onChange={(v) => onPickProduct(index, v)}
      >
        <option value="">{t.productCustom}</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </SelectField>

      <InputField
        id={id("description")}
        label={t.descriptionLabel}
        required
        hint={item.productId ? undefined : t.descriptionHint}
        error={err("description")}
        className="sm:col-span-6"
        autoComplete="off"
        value={item.description}
        onChange={(v) => onChange(index, { description: v })}
      />
      <InputField
        id={id("quantity")}
        label={t.quantityLabel}
        required
        error={err("quantity")}
        className="sm:col-span-2"
        inputMode="numeric"
        autoComplete="off"
        value={item.quantity}
        onChange={(v) => onChange(index, { quantity: v })}
      />
      <InputField
        id={id("unitPrice")}
        label={t.priceLabel}
        required
        error={err("unitPrice")}
        className="sm:col-span-2"
        inputMode="decimal"
        autoComplete="off"
        value={item.unitPrice}
        onChange={(v) => onChange(index, { unitPrice: v })}
      />
      <InputField
        id={id("unitCost")}
        label={t.costLabel}
        required
        hint={t.costHint}
        error={err("unitCost")}
        className="sm:col-span-2"
        inputMode="decimal"
        autoComplete="off"
        value={item.unitCost}
        onChange={(v) => onChange(index, { unitCost: v })}
      />
      <p className="text-sm font-medium text-charcoal sm:col-span-6">{format(t.lineProfit, { amount: formatMoney(profit, locale) })}</p>
    </RepeatableItem>
  );
}

export default OrderItemCard;
