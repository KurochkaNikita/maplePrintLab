"use client";

import type { ProductSaleOption } from "@maple-print-lab/db";
import type { FieldErrors, OrderItemValues } from "@/lib/finance/types";
import type { PrintCostValues } from "@/lib/print-cost/types";
import OrderItemDetails from "./OrderItemDetails";
import OrderItemHeader from "./OrderItemHeader";
import OrderItemPricing from "./OrderItemPricing";

export interface OrderItemCardProps {
  index: number;
  item: OrderItemValues;
  errors: FieldErrors;
  products: ProductSaleOption[];
  collapsed: boolean;
  onToggle: (index: number) => void;
  onChange: (index: number, patch: Partial<OrderItemValues>) => void;
  onPickProduct: (index: number, productId: string) => void;
  onPickCustom: (index: number, typed: string) => void;
  onPrintChange: (index: number, print: PrintCostValues) => void;
  onRemove: (index: number) => void;
}

/** One product of the order as its own foldable card. */
export function OrderItemCard({ collapsed, onToggle, onRemove, ...line }: OrderItemCardProps) {
  const titleId = `of-item-${line.index}-title`;
  const bodyId = `of-item-${line.index}-body`;

  return (
    // No overflow-hidden: the product suggestions open over the card's edge.
    <li aria-labelledby={titleId} className="rounded-2xl border border-line bg-white shadow-sm">
      <OrderItemHeader
        titleId={titleId}
        bodyId={bodyId}
        number={line.index + 1}
        item={line.item}
        collapsed={collapsed}
        onToggle={() => onToggle(line.index)}
        onRemove={() => onRemove(line.index)}
      />
      {/* Folded, not unmounted: focus can move to a field as soon as the card opens. */}
      <div id={bodyId} hidden={collapsed} className="p-4 sm:p-6">
        <div className="space-y-5">
          <OrderItemDetails {...line} />
          <OrderItemPricing {...line} />
        </div>
      </div>
    </li>
  );
}

export default OrderItemCard;
