/** Accepts "12.5" and "12,5" (French decimal comma); at most two decimals. Null when it is not an amount. */
export function parseMoney(raw: string): number | null {
  const s = raw.trim().replace(",", ".");
  return /^\d{1,8}(\.\d{1,2})?$/.test(s) ? Number(s) : null;
}

/** Money is summed in cents so 0.1 + 0.2 never shows as 0.30000000000000004. */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

const isDate = (raw: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false;
  const [y, m, d] = raw.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return y >= 2000 && y <= 2100 && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
};

/** A real calendar date written as YYYY-MM-DD. */
export const isValidDate = isDate;
