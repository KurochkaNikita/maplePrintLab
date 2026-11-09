import type { FinanceSeriesPoint, Granularity } from "@maple-print-lab/db";

export const PERIODS = ["d30", "d90", "m12", "ytd"] as const;
export type PeriodId = (typeof PERIODS)[number];
export const DEFAULT_PERIOD: PeriodId = "d30";

export function parsePeriod(raw: string | undefined): PeriodId {
  return (PERIODS as readonly string[]).includes(raw ?? "") ? (raw as PeriodId) : DEFAULT_PERIOD;
}

/** The shop is in Toronto: "today" must not flip to tomorrow at 7 pm local time because the server runs in UTC. */
export const SHOP_TIME_ZONE = "America/Toronto";

export function todayIso(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SHOP_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

const toDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const toIso = (date: Date) => date.toISOString().slice(0, 10);

export function addDays(iso: string, days: number): string {
  const date = toDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

/** First day of the bucket (Monday for weeks) that contains `iso`. */
export function bucketStart(iso: string, granularity: Granularity): string {
  if (granularity === "day") return iso;
  const date = toDate(iso);
  if (granularity === "month") date.setUTCDate(1);
  else date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return toIso(date);
}

function nextBucket(iso: string, granularity: Granularity): string {
  if (granularity === "day") return addDays(iso, 1);
  if (granularity === "week") return addDays(iso, 7);
  const date = toDate(iso);
  date.setUTCMonth(date.getUTCMonth() + 1);
  return toIso(date);
}

export type PeriodRange = { from: string; to: string; granularity: Granularity };

export function periodRange(period: PeriodId, today: string): PeriodRange {
  switch (period) {
    case "d30":
      return { from: addDays(today, -29), to: today, granularity: "day" };
    case "d90":
      return { from: addDays(today, -89), to: today, granularity: "week" };
    case "m12": {
      const date = toDate(bucketStart(today, "month"));
      date.setUTCMonth(date.getUTCMonth() - 11);
      return { from: toIso(date), to: today, granularity: "month" };
    }
    case "ytd":
      return { from: `${today.slice(0, 4)}-01-01`, to: today, granularity: "month" };
  }
}

/** Every bucket of the range, with zeros where nothing happened, so the chart has no holes. */
export function fillSeries(series: FinanceSeriesPoint[], { from, to, granularity }: PeriodRange): FinanceSeriesPoint[] {
  const byBucket = new Map(series.map((p) => [p.bucket, p]));
  const filled: FinanceSeriesPoint[] = [];
  for (let bucket = bucketStart(from, granularity); bucket <= to; bucket = nextBucket(bucket, granularity)) {
    filled.push(byBucket.get(bucket) ?? { bucket, income: 0, itemCost: 0, expenses: 0 });
  }
  return filled;
}
