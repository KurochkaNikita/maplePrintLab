// No imports on purpose: client components import this file directly, keeping the database driver out of the bundle.

export const ORDER_REQUEST_STATUSES = ["new", "replied", "converted", "spam", "closed"] as const;
export type OrderRequestStatus = (typeof ORDER_REQUEST_STATUSES)[number];
