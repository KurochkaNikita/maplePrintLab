import type { PrintJob, PrinterId } from "@maple-print-lab/db/src/print-job";
import { roundMoney } from "@/lib/finance/money";
import { FAILED_PRINT_RESERVE, MINIMUM_MARKUP, POWER_RATE_PER_KWH, PRINTERS, RECOMMENDED_MARKUP } from "./rates";

export type PrintCostInput = Pick<PrintJob, "printer" | "minutes" | "plastic" | "other">;

export function energyKwh(printer: PrinterId, minutes: number): number {
  return (PRINTERS[printer].watts / 1000) * (minutes / 60);
}

export function wearPerHour(printer: PrinterId): number {
  const { price, lifetimeHours, consumablesPerHour } = PRINTERS[printer];
  return price / lifetimeHours + consumablesPerHour;
}

/** Adds the electricity and the printer wear of one piece to what the admin typed in. */
export function buildPrintJob({ printer, minutes, plastic, other }: PrintCostInput): PrintJob {
  return {
    printer,
    minutes,
    plastic,
    other,
    electricity: roundMoney(energyKwh(printer, minutes) * POWER_RATE_PER_KWH),
    wear: roundMoney((minutes / 60) * wearPerHour(printer)),
  };
}

export function totalCost(job: PrintJob): number {
  return roundMoney(job.plastic + job.electricity + job.wear + job.other);
}

export type SuggestedPrices = {
  /** Cost plus the failed-print reserve: no loss and no profit on average. */
  breakEven: number;
  minimum: number;
  recommended: number;
};

/** The cost with the reserve and a markup, rounded up to the cent. */
function priceWithMarkup(cost: number, markup: number): number {
  // The inner rounding drops float noise, so an exact cent is not pushed up to the next one.
  return Math.ceil(Math.round(cost * (1 + FAILED_PRINT_RESERVE) * (1 + markup) * 1e6) / 1e4) / 100;
}

export function suggestedPrices(cost: number): SuggestedPrices {
  return {
    breakEven: priceWithMarkup(cost, 0),
    minimum: priceWithMarkup(cost, MINIMUM_MARKUP),
    recommended: priceWithMarkup(cost, RECOMMENDED_MARKUP),
  };
}

/** The markup a price makes over the cost with the reserve (0.5 = 50%); null when the cost is zero. */
export function markupOver(price: number, cost: number): number | null {
  const base = cost * (1 + FAILED_PRINT_RESERVE);
  return base > 0 ? price / base - 1 : null;
}

/** "loss": loses money once failed prints are counted; "low": profit under the minimum markup. */
export type PriceVerdict = "loss" | "low" | "ok" | "good";

export function priceVerdict(price: number, cost: number): PriceVerdict {
  const { breakEven, minimum, recommended } = suggestedPrices(cost);
  if (price < breakEven) return "loss";
  if (price < minimum) return "low";
  return price < recommended ? "ok" : "good";
}
