import type { PriceTier } from "@maple-print-lab/db/src/schema";
import { roundMoney } from "@/lib/finance/money";

export interface PricedProduct {
  /** Decimal string of a single price, null when the product has price tiers. */
  priceAmount: string | null;
  priceTiers: PriceTier[] | null;
  /** Decimal string, null when the cost was never entered. */
  costAmount: string | null;
}

export interface UnitMargin {
  /** Price of one piece used for the calculation (the first tier for volume pricing). */
  price: number;
  cost: number;
  amount: number;
  /** Margin as a share of the price, 0–100; null when the price is zero. */
  percent: number | null;
  /** The price came from the first of several tiers. */
  fromFirstTier: boolean;
}

/** Price of one piece: the single price, or the first tier; null when neither is set. */
export function basePrice(product: PricedProduct): { price: number; fromFirstTier: boolean } | null {
  if (product.priceAmount !== null) return { price: Number(product.priceAmount), fromFirstTier: false };
  const first = product.priceTiers?.[0];
  return first ? { price: first.amount, fromFirstTier: true } : null;
}

/** Margin of one piece, or null when the price or the cost is not set. */
export function unitMargin(product: PricedProduct): UnitMargin | null {
  const base = basePrice(product);
  if (!base || product.costAmount === null) return null;
  const cost = Number(product.costAmount);
  const amount = roundMoney(base.price - cost);
  return {
    price: base.price,
    cost,
    amount,
    percent: base.price > 0 ? Math.round((amount / base.price) * 1000) / 10 : null,
    fromFirstTier: base.fromFirstTier,
  };
}

/** Profit of one sold line: pieces × (price − cost). */
export function lineProfit(quantity: number, unitPrice: number, unitCost: number): number {
  return roundMoney(quantity * (unitPrice - unitCost));
}
