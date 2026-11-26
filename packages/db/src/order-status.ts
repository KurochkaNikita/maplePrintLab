// No imports on purpose: client components import this file directly, keeping the database driver out of the bundle.

/** Production stage of an order, in the order it goes through them. */
export const ORDER_STATUSES = ["in_progress", "done", "delivered"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
