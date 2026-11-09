import { parseMoney, roundMoney } from "./money";
import type { OrderItemValues } from "./types";

/** Money of one line as typed so far; 0 while a field is blank or invalid. */
export function lineAmounts(item: OrderItemValues) {
  const quantity = Number.isInteger(Number(item.quantity)) ? Math.max(0, Number(item.quantity)) : 0;
  const price = parseMoney(item.unitPrice) ?? 0;
  const cost = parseMoney(item.unitCost) ?? 0;
  return { revenue: roundMoney(quantity * price), cost: roundMoney(quantity * cost), profit: roundMoney(quantity * (price - cost)) };
}

