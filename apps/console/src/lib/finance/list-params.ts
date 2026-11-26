import type { SortDirection } from "@maple-print-lab/db";

/** Reads `?status=`: "desc" reverses the status groups; anything else is the default order. */
export const parseStatusDir = (value: string | undefined): SortDirection => (value === "desc" ? "desc" : "asc");

/** Link to a page of the orders list that keeps the sort; the defaults need no parameter. */
export function ordersListHref({ statusDir, page = 1 }: { statusDir: SortDirection; page?: number }): string {
  const params = new URLSearchParams();
  if (statusDir === "desc") params.set("status", statusDir);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/orders?${qs}` : "/orders";
}
