"use client";

import { useLocale, useT } from "@/components/LocaleProvider";
import { formatMoney } from "@/lib/finance/format";
import { format } from "@/lib/i18n";
import { priceVerdict, suggestedPrices } from "@/lib/print-cost/calc";
import { priceCards } from "@/lib/print-cost/comparison";
import { FAILED_PRINT_RESERVE } from "@/lib/print-cost/rates";
import CostBlock, { type CostBlockVariant } from "./CostBlock";
import PriceCardItem from "./PriceCardItem";

export interface PriceComparisonProps {
  /** Our cost of one piece; nothing is shown until it is known. */
  cost: number | null;
  /** Our selling price of one piece, null until typed. */
  price: number | null;
  /** Says which price is compared, when there are several. */
  note?: string;
  variant?: CostBlockVariant;
  className?: string;
}

/** Our price next to the minimum and the recommended one, with the verdict in words (not only colour). */
export function PriceComparison({ cost, price, note, variant = "card", className = "" }: PriceComparisonProps) {
  const t = useT().printCost;
  const locale = useLocale();
  if (cost === null || cost <= 0) return null;

  const cards = priceCards(cost, price, t, locale);
  const verdict = price === null ? null : priceVerdict(price, cost);
  const warns = verdict === "loss" || verdict === "low";
  const columns = cards.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <CostBlock
      title={t.comparisonTitle}
      tip={format(t.priceNote, {
        reserve: Math.round(FAILED_PRINT_RESERVE * 100),
        breakEven: formatMoney(suggestedPrices(cost).breakEven, locale),
      })}
      variant={variant}
      className={className}
    >
      <div className="space-y-2">
        <dl className={`grid gap-3 ${columns}`}>
          {cards.map(({ id, ...card }) => (
            <PriceCardItem key={id} {...card} />
          ))}
        </dl>
        <p className={`text-sm font-medium ${warns ? "text-amber-deep" : "text-charcoal"}`}>
          {verdict ? t.verdict[verdict] : t.enterPrice}
        </p>
        {note && price !== null && <p className="text-sm text-ink">{note}</p>}
      </div>
    </CostBlock>
  );
}

export default PriceComparison;
