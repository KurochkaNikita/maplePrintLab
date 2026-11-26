import type { PrinterId } from "@maple-print-lab/db/src/print-job";

/**
 * Every assumption of the print cost estimate, in CAD. Change the numbers here.
 * Saved products and order lines keep their amounts until they are saved again.
 */

/** BC Hydro flat rate 12.63 ¢/kWh (2025) + 3.75% (April 2026) + 5% GST, rounded up. */
export const POWER_RATE_PER_KWH = 0.14;

/** Added on top of the cost in every suggested price, to pay for failed prints. */
export const FAILED_PRINT_RESERVE = 0.1;

/** Markups over the cost with the reserve: the lowest worth selling at, and the one to aim for. */
export const MINIMUM_MARKUP = 0.5;
export const RECOMMENDED_MARKUP = 1;

export type PrinterProfile = {
  name: string;
  /** Average draw while printing PLA, not the peak. */
  watts: number;
  /** What we paid for the printer, CAD. */
  price: number;
  /** Printing hours over which the price is written off. An estimate. */
  lifetimeHours: number;
  /** Nozzles, build plates, belts, lubricant per printing hour. An estimate. */
  consumablesPerHour: number;
};

export const PRINTERS: Record<PrinterId, PrinterProfile> = {
  a2l: { name: "Bambu Lab A2L", watts: 145, price: 700, lifetimeHours: 5000, consumablesPerHour: 0.1 },
  x2d: { name: "Bambu Lab X2D", watts: 200, price: 900, lifetimeHours: 5000, consumablesPerHour: 0.15 },
};
