"use client";

import IconButton from "@/components/IconButton";
import { useLocale, useT } from "@/components/LocaleProvider";
import ChevronDownIcon from "@/icons/chevron-down.svg";
import TrashIcon from "@/icons/trash.svg";
import { formatMoney } from "@/lib/finance/format";
import { parseMoney } from "@/lib/finance/money";
import { lineAmounts } from "@/lib/finance/totals";
import type { OrderItemValues } from "@/lib/finance/types";
import { format } from "@/lib/i18n";

export interface OrderItemHeaderProps {
  titleId: string;
  /** Id of the part the header folds. */
  bodyId: string;
  number: number;
  item: OrderItemValues;
  collapsed: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

/** Number, name and money of one order line; pressing it folds or opens the line. */
export function OrderItemHeader({ titleId, bodyId, number, item, collapsed, onToggle, onRemove }: OrderItemHeaderProps) {
  const t = useT().pages.orders.form.items;
  const locale = useLocale();
  const price = parseMoney(item.unitPrice);
  const summary =
    price === null
      ? t.noPrice
      : format(t.summary, {
          quantity: item.quantity || "0",
          price: formatMoney(price, locale),
          profit: formatMoney(lineAmounts(item).profit, locale),
        });

  return (
    <div className={`flex items-center gap-2 bg-filament px-3 py-2 sm:px-4 ${collapsed ? "rounded-2xl" : "rounded-t-2xl border-b border-line"}`}>
      <h3 className="min-w-0 flex-1">
        <button
          type="button"
          aria-expanded={!collapsed}
          aria-controls={bodyId}
          onClick={onToggle}
          className="flex min-h-11 w-full items-center gap-3 rounded-lg text-left"
        >
          <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal text-sm font-semibold text-filament">
            {number}
          </span>
          <span className="min-w-0 flex-1">
            <span id={titleId} className="block truncate font-display text-base font-semibold text-charcoal">
              <span className="visually-hidden">{format(t.itemTitle, { n: number })}: </span>
              {item.description.trim() || t.untitled}
            </span>
            <span className="block text-sm text-ink">{summary}</span>
          </span>
          <ChevronDownIcon className={`h-5 w-5 shrink-0 text-charcoal ${collapsed ? "" : "rotate-180"}`.trim()} />
        </button>
      </h3>
      <IconButton icon={TrashIcon} tone="danger" label={format(t.remove, { n: number })} onClick={onRemove} />
    </div>
  );
}

export default OrderItemHeader;
