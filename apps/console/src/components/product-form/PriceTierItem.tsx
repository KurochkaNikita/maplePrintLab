"use client";

import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import RepeatableItem from "@/components/RepeatableItem";
import { useProductFormContext } from "@/hooks/useProductFormContext";
import { format } from "@/lib/i18n";
import { fieldId, type PriceTierValues } from "@/lib/products/types";
import { errorText } from "./shared";

export interface PriceTierItemProps {
  index: number;
  tier: PriceTierValues;
  onChange: (index: number, field: keyof PriceTierValues, value: string) => void;
  onRemove: (index: number) => void;
}

/** One volume-price row: from, to and the price per piece. */
export function PriceTierItem({ index, tier, onChange, onRemove }: PriceTierItemProps) {
  const { errors } = useProductFormContext();
  const dict = useT();
  const t = dict.pages.products.form.pricing;
  const n = index + 1;
  const err = (field: string) => errorText(errors, `priceTiers.${index}.${field}`, dict);

  return (
    <RepeatableItem
      id={`pf-tier-${index}`}
      title={format(t.tierItemTitle, { n })}
      removeLabel={format(t.removeTier, { n })}
      onRemove={() => onRemove(index)}
      bodyClassName="sm:grid-cols-3"
    >
      <InputField
        id={fieldId(`priceTiers.${index}.from`)}
        label={t.tierFrom}
        required
        error={err("from")}
        inputMode="numeric"
        autoComplete="off"
        value={tier.from}
        onChange={(v) => onChange(index, "from", v)}
      />
      <InputField
        id={fieldId(`priceTiers.${index}.to`)}
        label={t.tierTo}
        hint={t.tierToHint}
        error={err("to")}
        inputMode="numeric"
        autoComplete="off"
        value={tier.to}
        onChange={(v) => onChange(index, "to", v)}
      />
      <InputField
        id={fieldId(`priceTiers.${index}.amount`)}
        label={t.tierAmount}
        required
        error={err("amount")}
        inputMode="decimal"
        autoComplete="off"
        value={tier.amount}
        onChange={(v) => onChange(index, "amount", v)}
      />
    </RepeatableItem>
  );
}

export default PriceTierItem;
