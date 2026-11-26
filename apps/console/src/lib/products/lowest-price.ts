import { parseMoney } from "@/lib/finance/money";
import type { ProductFormValues } from "./types";

/** The cheapest price of one piece as typed: the one that must still cover the cost. Null while none is valid. */
export function lowestPrice(values: ProductFormValues): number | null {
  const raw = values.priceMode === "tiers" ? values.priceTiers.map((tier) => tier.amount) : [values.priceAmount];
  const prices = raw.map(parseMoney).filter((price): price is number => price !== null && price > 0);
  return prices.length ? Math.min(...prices) : null;
}
