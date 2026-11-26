import type { ComponentType, SVGProps } from "react";
import StatusIcon from "@/components/StatusIcon";
import CheckIcon from "@/icons/check.svg";
import ClockIcon from "@/icons/clock.svg";
import PackageIcon from "@/icons/package.svg";
import type { OrderStatus } from "@/lib/finance/order-status";

export interface OrderStatusIconProps {
  status: OrderStatus;
  /** Translated name of the status: shown in the tooltip and read by screen readers. */
  label: string;
}

/** Soft tints, like the product status icons. The shapes differ too, so colour is never the only signal. */
const looks: Record<OrderStatus, { icon: ComponentType<SVGProps<SVGSVGElement>>; className: string }> = {
  in_progress: { icon: ClockIcon, className: "border-yellow-700/30 bg-yellow-50 text-yellow-700" },
  done: { icon: PackageIcon, className: "border-blue-700/30 bg-blue-50 text-blue-700" },
  delivered: { icon: CheckIcon, className: "border-green-700/30 bg-green-50 text-green-700" },
};

/** Status of an order as a small round coloured icon with a tooltip. */
export function OrderStatusIcon({ status, label }: OrderStatusIconProps) {
  return <StatusIcon {...looks[status]} label={label} />;
}

export default OrderStatusIcon;
