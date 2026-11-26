import { totalCost } from "@/lib/print-cost/calc";
import { parsePrintCost } from "@/lib/print-cost/values";
import { parseMoney, roundMoney } from "./money";
import type { OrderItemValues } from "./types";

/** Our cost of one piece: calculated when a printer is chosen, otherwise typed in. Null while blank or invalid. */
export function itemUnitCost(item: OrderItemValues): number | null {
  if (!item.print.printer) return parseMoney(item.unitCost);
  const result = parsePrintCost(item.print);
  return "job" in result ? totalCost(result.job) : null;
}

/** Money of one line as typed so far; 0 while a field is blank or invalid. */
export function lineAmounts(item: OrderItemValues) {
  const quantity = Number.isInteger(Number(item.quantity)) ? Math.max(0, Number(item.quantity)) : 0;
  const price = parseMoney(item.unitPrice) ?? 0;
  const cost = itemUnitCost(item) ?? 0;
  return { revenue: roundMoney(quantity * price), cost: roundMoney(quantity * cost), profit: roundMoney(quantity * (price - cost)) };
}

