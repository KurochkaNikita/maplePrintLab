import type { ExpenseRecord, OrderRecord } from "@maple-print-lab/db";
import type { ExpenseFormValues, OrderFormValues, OrderItemValues } from "./types";

export const emptyOrderItem = (): OrderItemValues => ({
  productId: "",
  description: "",
  quantity: "1",
  unitPrice: "",
  unitCost: "",
});

export function emptyOrderValues(today: string): OrderFormValues {
  return { orderedOn: today, channelId: "", note: "", items: [emptyOrderItem()] };
}

export function toOrderFormValues(order: OrderRecord): OrderFormValues {
  return {
    orderedOn: order.orderedOn,
    channelId: String(order.channelId),
    note: order.note,
    items: order.items.map((item) => ({
      productId: item.productId === null ? "" : String(item.productId),
      description: item.description,
      quantity: String(item.quantity),
      unitPrice: item.unitPrice,
      unitCost: item.unitCost,
    })),
  };
}

export function emptyExpenseValues(today: string): ExpenseFormValues {
  return { spentOn: today, categoryId: "", description: "", amount: "" };
}

export function toExpenseFormValues(expense: ExpenseRecord): ExpenseFormValues {
  return {
    spentOn: expense.spentOn,
    categoryId: String(expense.categoryId),
    description: expense.description,
    amount: expense.amount,
  };
}
