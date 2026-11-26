import { PRINTER_IDS, type PrintJob, type PrinterId } from "@maple-print-lab/db/src/print-job";
import { parseMoney } from "@/lib/finance/money";
import { buildPrintJob } from "./calc";
import type { PrintCostErrors, PrintCostValues } from "./types";

const MAX_HOURS = 999;

export const emptyPrintCost = (): PrintCostValues => ({ printer: "", hours: "", minutes: "", plastic: "", other: "" });

export function toPrintCostValues(job: PrintJob | null): PrintCostValues {
  if (!job) return emptyPrintCost();
  return {
    printer: job.printer,
    hours: String(Math.floor(job.minutes / 60)),
    minutes: String(job.minutes % 60),
    plastic: job.plastic.toFixed(2),
    other: job.other ? job.other.toFixed(2) : "",
  };
}

export const isPrinterId = (value: string): value is PrinterId => (PRINTER_IDS as readonly string[]).includes(value);

/** A blank part of the time counts as zero; null when it is not a whole number up to `max`. */
const timePart = (raw: string, max: number): number | null => {
  const s = raw.trim();
  if (!s) return 0;
  return /^\d+$/.test(s) && Number(s) <= max ? Number(s) : null;
};

/** The print job of the typed values, or what is wrong with them. Call it only when a printer is chosen. */
export function parsePrintCost(values: PrintCostValues): { job: PrintJob } | { errors: PrintCostErrors } {
  const errors: PrintCostErrors = {};
  const { printer } = values;

  const hours = timePart(values.hours, MAX_HOURS);
  const minutes = timePart(values.minutes, 59);
  if (hours === null) errors.hours = { code: "invalidTime" };
  if (minutes === null) errors.minutes = { code: "invalidTime" };
  const total = (hours ?? 0) * 60 + (minutes ?? 0);
  if (hours !== null && minutes !== null && total === 0) errors.hours = { code: "required" };

  const plastic = parseMoney(values.plastic);
  if (!values.plastic.trim()) errors.plastic = { code: "required" };
  else if (plastic === null) errors.plastic = { code: "invalidPrice" };

  const other = values.other.trim() ? parseMoney(values.other) : 0;
  if (other === null) errors.other = { code: "invalidPrice" };

  if (!isPrinterId(printer)) errors.printer = { code: "required" };
  if (Object.keys(errors).length || !isPrinterId(printer)) return { errors };
  return { job: buildPrintJob({ printer, minutes: total, plastic: plastic ?? 0, other: other ?? 0 }) };
}
