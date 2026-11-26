"use client";

import type { FinanceOption, ProductSaleOption } from "@maple-print-lab/db";
import { useEffect, useState } from "react";
import { useT } from "@/components/LocaleProvider";
import { createOrder, updateOrder } from "@/lib/finance/actions";
import { emptyOrderItem } from "@/lib/finance/form-values";
import { roundMoney } from "@/lib/finance/money";
import { lineAmounts } from "@/lib/finance/totals";
import { fieldId, type OrderFormValues, type OrderItemValues } from "@/lib/finance/types";
import { validateOrder } from "@/lib/finance/validation";
import { PRINT_COST_FIELDS, type PrintCostValues } from "@/lib/print-cost/types";
import { toPrintCostValues } from "@/lib/print-cost/values";
import { useCollapsedItems } from "./useCollapsedItems";
import { useFinanceForm } from "./useFinanceForm";

/** `requestId`: the order is created from a customer request and links back to it. */
export type OrderFormTarget = { mode: "create"; requestId?: string } | { mode: "edit"; orderId: string };

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
    save: (values) => (target.mode === "create" ? createOrder(values, target.requestId) : updateOrder(target.orderId, values)),
    resetAfterSave: target.mode === "create",
    redirectTo: target.mode === "create" && target.requestId ? `/requests/${target.requestId}` : undefined,
    messages: { created: t.status.created, saved: t.status.saved },
  });
  const { values, change, clearErrors } = form;
  const folding = useCollapsedItems(values.items.length, form.errors);
  const [addedIndex, setAddedIndex] = useState<number | null>(null);

  // A new line starts at its product search.
  useEffect(() => {
    if (addedIndex !== null) document.getElementById(fieldId("of", `items.${addedIndex}.productId`))?.focus();
  }, [addedIndex]);

  const setItem = (index: number, patch: Partial<OrderItemValues>) => {
    // The calculator is one nested value: editing it clears the messages of all its fields.
    const touched = Object.keys(patch).flatMap((field) =>
      field === "print" ? PRINT_COST_FIELDS.map((f) => `items.${index}.print.${f}`) : [`items.${index}.${field}`],
    );
    change({ ...values, items: values.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) }, ...touched);
  };

  /** Choosing a catalogue product prefills the line from it; choosing "custom" keeps what was typed. */
  const pickProduct = (index: number, productId: string) => {
    const product = products.find((p) => String(p.id) === productId);
    setItem(
      index,
      product
        ? { productId, description: product.title, unitPrice: product.price, unitCost: product.cost, print: toPrintCostValues(product.printJob) }
        : { productId: "" },
    );
  };

  const setPrint = (index: number, print: PrintCostValues) => setItem(index, { print });

  /** A product that is not in the catalogue: the typed text, if any, becomes its description. */
  const pickCustom = (index: number, typed: string) =>
    setItem(index, typed ? { productId: "", description: typed } : { productId: "" });

  const addItem = () => {
    folding.collapseAll();
    setAddedIndex(values.items.length);
    change({ ...values, items: [...values.items, emptyOrderItem()] }, "items");
  };

  const removeItem = (index: number) => {
    // Later rows shift up, so their error keys are stale.
    clearErrors();
    folding.forget(index);
    setAddedIndex(null);
    change({ ...values, items: values.items.filter((_, i) => i !== index) });
  };

  const totals = values.items.map(lineAmounts).reduce(
    (sum, line) => ({ revenue: roundMoney(sum.revenue + line.revenue), cost: roundMoney(sum.cost + line.cost), profit: roundMoney(sum.profit + line.profit) }),
    { revenue: 0, cost: 0, profit: 0 },
  );

  return { ...form, setItem, setPrint, pickProduct, pickCustom, isCollapsed: folding.isCollapsed, toggleItem: folding.toggle, addItem, removeItem, totals, isEdit: target.mode === "edit" };
}
