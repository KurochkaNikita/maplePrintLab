/** Width × height × depth, written in both units so the copy can show round numbers (25 cm = 10 in). */
export const DIMENSION_AXES = ["width", "height", "depth"] as const;
export const DIMENSION_UNITS = ["cm", "in"] as const;
export type DimensionUnit = (typeof DIMENSION_UNITS)[number];

const CM_PER_INCH = 2.54;

/**
 * "25" -> "9.8" (cm to in) and "10" -> "25.4" (in to cm), rounded to one decimal.
 * Null when the input is not a positive number. Accepts a decimal comma.
 */
export function convertLength(raw: string, from: DimensionUnit): string | null {
  const s = raw.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(s) || Number(s) <= 0) return null;
  const n = from === "cm" ? Number(s) / CM_PER_INCH : Number(s) * CM_PER_INCH;
  return String(Number(n.toFixed(1)));
}
