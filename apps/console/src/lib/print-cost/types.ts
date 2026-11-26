/** Form values of the print cost calculator; strings like every other field. */
export type PrintCostValues = {
  /** A `PrinterId`, or "" when the cost is typed in by hand. */
  printer: string;
  hours: string;
  minutes: string;
  plastic: string;
  other: string;
};

export type PrintCostField = keyof PrintCostValues;

export const PRINT_COST_FIELDS: readonly PrintCostField[] = ["printer", "hours", "minutes", "plastic", "other"];

export type PrintCostErrorCode = "required" | "invalidPrice" | "invalidTime";

export type PrintCostErrors = Partial<Record<PrintCostField, { code: PrintCostErrorCode }>>;
