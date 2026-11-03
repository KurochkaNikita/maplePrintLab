"use client";

import Button from "@/components/Button";
import { useT } from "@/components/LocaleProvider";
import { useProductFormContext } from "@/hooks/useProductFormContext";
import { fieldId, type PriceTierValues } from "@/lib/products/types";
import PriceTierItem from "./PriceTierItem";
import { errorText } from "./shared";

/** Optional volume pricing: rows of "from – to pieces → price per piece". */
export function PriceTiersEditor() {
  const { values, errors, change: onChange } = useProductFormContext();
  const dict = useT();
  const t = dict.pages.products.form.pricing;
  const tiers = values.priceTiers;
  const err = (key: string) => errorText(errors, key, dict);
  const tiersError = err("priceTiers");

  const setTier = (index: number, field: keyof PriceTierValues, value: string) => {
    const next = tiers.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier));
    onChange({ ...values, priceTiers: next }, `priceTiers.${index}.${field}`);
  };

  const removeTier = (index: number) => {
    // Later rows shift up, so their error keys are stale: drop every tier error.
    const stale = tiers.flatMap((_, i) => [`priceTiers.${i}.from`, `priceTiers.${i}.to`, `priceTiers.${i}.amount`]);
    onChange({ ...values, priceTiers: tiers.filter((_, i) => i !== index) }, ...stale);
  };

  const addTier = () => {
    const last = tiers[tiers.length - 1];
    // An open-ended last row has no upper bound to continue from (Number("") would be 0).
    const lastTo = last?.to.trim() ? Number(last.to) : NaN;
    const from = Number.isInteger(lastTo) ? String(lastTo + 1) : "";
    // Adding a row answers the "add at least one tier" error.
    onChange({ ...values, priceTiers: [...tiers, { from, to: "", amount: "" }] }, "priceTiers");
  };

  return (
    <div>
      <p className="text-sm text-ink">{t.tiersHint}</p>

      {tiers.length > 0 && (
        <ul className="mt-4 space-y-6">
          {tiers.map((tier, index) => (
            <PriceTierItem key={index} index={index} tier={tier} onChange={setTier} onRemove={removeTier} />
          ))}
        </ul>
      )}

      <Button id={fieldId("priceTiers")} type="button" variant="secondary" size="sm" className="mt-3" onClick={addTier}>
        {t.addTier}
      </Button>
      {tiersError && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-700">
          {tiersError}
        </p>
      )}
    </div>
  );
}

export default PriceTiersEditor;
