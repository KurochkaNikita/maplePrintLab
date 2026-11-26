"use client";

import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import PriceComparison from "@/components/print-cost/PriceComparison";
import PrintCostFields from "@/components/print-cost/PrintCostFields";
import { errorText } from "@/lib/finance/error-text";
import { parseMoney } from "@/lib/finance/money";
import { itemUnitCost } from "@/lib/finance/totals";
import { fieldId } from "@/lib/finance/types";
import type { OrderItemCardProps } from "./OrderItemCard";

export type OrderItemPricingProps = Pick<OrderItemCardProps, "index" | "item" | "errors" | "onChange" | "onPrintChange">;

/** First our cost of one piece, then the price we sell it at and how that compares. */
export function OrderItemPricing({ index, item, errors, onChange, onPrintChange }: OrderItemPricingProps) {
  const dict = useT();
  const t = dict.pages.orders.form.items;
  const key = (field: string) => `items.${index}.${field}`;
  const id = (field: string) => fieldId("of", key(field));
  const err = (field: string) => errorText(errors, key(field), dict);

  return (
    <>
      <PrintCostFields
        variant="section"
        idFor={(field) => id(`print.${field}`)}
        values={item.print}
        errorFor={(field) => err(`print.${field}`)}
        onChange={(print) => onPrintChange(index, print)}
        manual={
          <InputField
            id={id("unitCost")}
            label={t.costLabel}
            required
            tip={t.costHint}
            error={err("unitCost")}
            className="max-w-sm"
            inputMode="decimal"
            autoComplete="off"
            value={item.unitCost}
            onChange={(v) => onChange(index, { unitCost: v })}
          />
        }
      />
      <div className="border-t border-line pt-5">
        <InputField
          id={id("unitPrice")}
          label={t.priceLabel}
          required
          error={err("unitPrice")}
          className="max-w-sm"
          inputMode="decimal"
          autoComplete="off"
          value={item.unitPrice}
          onChange={(v) => onChange(index, { unitPrice: v })}
        />
      </div>
      <PriceComparison variant="section" cost={itemUnitCost(item)} price={parseMoney(item.unitPrice)} />
    </>
  );
}

export default OrderItemPricing;
