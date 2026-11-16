import { ORDER_REQUEST_STATUSES, type OrderRequestStatus } from "@maple-print-lab/db/src/order-request-status";

export { ORDER_REQUEST_STATUSES, type OrderRequestStatus };

export const isRequestStatus = (value: unknown): value is OrderRequestStatus =>
  typeof value === "string" && (ORDER_REQUEST_STATUSES as readonly string[]).includes(value);

export const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

/** Link to a page of the requests list that keeps the status filter. */
export function requestsHref(status: OrderRequestStatus | undefined, page = 1): string {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/requests?${query}` : "/requests";
}
