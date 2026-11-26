import { parseMoney } from "@/lib/finance/money";
import { totalCost } from "@/lib/print-cost/calc";
import { parsePrintCost } from "@/lib/print-cost/values";
import type { ProductFormValues } from "./types";

/** Our cost of one piece as typed: calculated when a printer is chosen, otherwise typed in. Null while blank or invalid. */
export function productCost(values: ProductFormValues): number | null {
  if (!values.print.printer) return parseMoney(values.costAmount);
  const result = parsePrintCost(values.print);
  return "job" in result ? totalCost(result.job) : null;
}
