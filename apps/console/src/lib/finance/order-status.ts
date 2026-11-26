import { ORDER_STATUSES, type OrderStatus } from "@maple-print-lab/db/src/order-status";

export { ORDER_STATUSES, type OrderStatus };

export const isOrderStatus = (value: string): value is OrderStatus => (ORDER_STATUSES as readonly string[]).includes(value);
