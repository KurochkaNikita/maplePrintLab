"use client";

import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import { errorText } from "@/lib/finance/error-text";
import { fieldId } from "@/lib/finance/types";
import type { OrderItemCardProps } from "./OrderItemCard";
import OrderProductPicker from "./OrderProductPicker";

export type OrderItemDetailsProps = Pick<
  OrderItemCardProps,
  "index" | "item" | "errors" | "products" | "onChange" | "onPickProduct" | "onPickCustom"
>;

/** What is sold: the product, its description and how many. */
export function OrderItemDetails({ index, item, errors, products, onChange, onPickProduct, onPickCustom }: OrderItemDetailsProps) {
  const dict = useT();
  const t = dict.pages.orders.form.items;
  const key = (field: string) => `items.${index}.${field}`;
  const id = (field: string) => fieldId("of", key(field));
  const err = (field: string) => errorText(errors, key(field), dict);

  return (
    <div className="grid gap-4 sm:grid-cols-6">
      <OrderProductPicker
        id={id("productId")}
        products={products}
        value={item.productId}
        error={err("productId")}
        onPick={(productId) => onPickProduct(index, productId)}
        onPickCustom={(typed) => onPickCustom(index, typed)}
        className="sm:col-span-6"
      />
      <InputField
        id={id("description")}
        label={t.descriptionLabel}
        required
        error={err("description")}
        className="sm:col-span-4"
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
    </div>
  );
}

export default OrderItemDetails;
