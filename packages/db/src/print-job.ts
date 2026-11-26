// Dependency-free: client components import it directly.

export const PRINTER_IDS = ["a2l", "x2d"] as const;
export type PrinterId = (typeof PRINTER_IDS)[number];

/** How the cost of one printed piece was worked out. Amounts are CAD, copied when saved. */
export type PrintJob = {
  printer: PrinterId;
  /** Print time of one piece. */
  minutes: number;
  plastic: number;
  /** Packaging, hardware and anything else per piece. */
  other: number;
  electricity: number;
  /** Printer depreciation and consumables. */
  wear: number;
};
