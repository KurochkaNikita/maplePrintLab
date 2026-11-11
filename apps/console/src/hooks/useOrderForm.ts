"use client";

import type { FinanceOption, ProductSaleOption } from "@maple-print-lab/db";
import { useT } from "@/components/LocaleProvider";
import { createOrder, updateOrder } from "@/lib/finance/actions";
import { emptyOrderItem } from "@/lib/finance/form-values";
import { roundMoney } from "@/lib/finance/money";
import { lineAmounts } from "@/lib/finance/totals";
import type { OrderFormValues, OrderItemValues } from "@/lib/finance/types";
import { validateOrder } from "@/lib/finance/validation";
import { useFinanceForm } from "./useFinanceForm";

export type OrderFormTarget = { mode: "create" } | { mode: "edit"; orderId: string };

export interface UseOrderFormOptions {
  target: OrderFormTarget;
  initialValues: OrderFormValues;
  channels: FinanceOption[];
  products: ProductSaleOption[];
}

/** The order form: shared form state plus helpers for the list of order lines. */
export function useOrderForm({ target, initialValues, channels, products }: UseOrderFormOptions) {
  const t = useT().pages.orders.form;
  const form = useFinanceForm<OrderFormValues>({
    initialValues,
    idPrefix: "of",
    validate: (values) => {
      const result = validateOrder(values, {
        channelExists: channels.some((c) => String(c.id) === values.channelId.trim()),
        productExists: (id) => products.some((p) => p.id === id),
      });
      return "errors" in result ? result.errors : null;
    },
    save: (values) => (target.mode === "create" ? createOrder(values) : updateOrder(target.orderId, values)),
    resetAfterSave: target.mode === "create",
    messages: { created: t.status.created, saved: t.status.saved },
  });
  const { values, change, clearErrors } = form;

  const setItem = (index: number, patch: Partial<OrderItemValues>) => {
    const touched = Object.keys(patch).map((field) => `items.${index}.${field}`);
    change({ ...values, items: values.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) }, ...touched);
  };

  /** Choosing a catalogue product prefills the line from it; choosing "custom" keeps what was typed. */
  const pickProduct = (index: number, productId: string) => {
    const product = products.find((p) => String(p.id) === productId);
    setItem(
      index,
      product
        ? { productId, description: product.title, unitPrice: product.price, unitCost: product.cost }
        : { productId: "" },
    );
  };

  const addItem = () => change({ ...values, items: [...values.items, emptyOrderItem()] }, "items");

  const removeItem = (index: number) => {
    // Later rows shift up, so their error keys are stale.
    clearErrors();
    change({ ...values, items: values.items.filter((_, i) => i !== index) });
  };

  const totals = values.items.map(lineAmounts).reduce(
    (sum, line) => ({ revenue: roundMoney(sum.revenue + line.revenue), cost: roundMoney(sum.cost + line.cost), profit: roundMoney(sum.profit + line.profit) }),
    { revenue: 0, cost: 0, profit: 0 },
  );

  return { ...form, setItem, pickProduct, addItem, removeItem, totals, isEdit: target.mode === "edit" };
}
