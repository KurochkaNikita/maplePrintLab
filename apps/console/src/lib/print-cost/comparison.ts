import { formatMoney } from "@/lib/finance/format";
import { roundMoney } from "@/lib/finance/money";
import { format, type Locale } from "@/lib/i18n";
import type { PrintCostStrings } from "@/lib/i18n/print-cost/ru";
import { markupOver, suggestedPrices } from "./calc";
import { MINIMUM_MARKUP, RECOMMENDED_MARKUP } from "./rates";

export type PriceCard = {
  id: "minimum" | "recommended" | "ours";
  label: string;
  amount: string;
  details: string[];
  /** The card with our own price gets a stronger frame. */
  highlighted: boolean;
};

/**
 * The cards of the price comparison: minimum, recommended and ours (once typed).
 * When ours equals the recommended price to the cent, the two become one card.
 */
export function priceCards(cost: number, price: number | null, t: PrintCostStrings, locale: Locale): PriceCard[] {
  const money = (amount: number) => formatMoney(amount, locale);
  const prices = suggestedPrices(cost);
  const markup = (share: number) => `${t.perPiece}, ${format(t.markup, { percent: Math.round(share * 100) })}`;
  const profit = (ours: number) => format(t.profit, { amount: money(roundMoney(ours - cost)) });
  const merged = price !== null && roundMoney(price) === prices.recommended;

  const cards: PriceCard[] = [
    { id: "minimum", label: t.minimum, amount: money(prices.minimum), details: [markup(MINIMUM_MARKUP)], highlighted: false },
    {
      id: "recommended",
      label: merged ? t.recommendedIsOurs : t.recommended,
      amount: money(prices.recommended),
      details: merged ? [markup(RECOMMENDED_MARKUP), profit(prices.recommended)] : [markup(RECOMMENDED_MARKUP)],
      highlighted: merged,
    },
  ];
  if (price === null || merged) return cards;

  const share = markupOver(price, cost);
  const details = share === null ? [profit(price)] : [markup(share), profit(price)];
  return [...cards, { id: "ours", label: t.ours, amount: money(price), details, highlighted: true }];
}
