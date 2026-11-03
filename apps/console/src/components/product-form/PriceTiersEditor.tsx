"use client";

import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import { useProductFormContext } from "@/hooks/useProductFormContext";
import TrashIcon from "@/icons/trash.svg";
import { format } from "@/lib/i18n";
import { fieldId } from "@/lib/products/types";
import { errorText } from "./shared";

/** Optional volume pricing: rows of "from – to pieces → price per piece". */
export function PriceTiersEditor() {
  const { values, errors, change: onChange } = useProductFormContext();
  const dict = useT();
  const t = dict.pages.products.form.pricing;
  const tiers = values.priceTiers;
  const err = (key: string) => errorText(errors, key, dict);
  const tiersError = err("priceTiers");

  const setTier = (index: number, field: "from" | "to" | "amount", value: string) => {
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
            <li
              key={index}
              role="group"
              aria-labelledby={`pf-tier-${index}-title`}
              className="border-t border-line pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 id={`pf-tier-${index}-title`} className="text-sm font-semibold text-charcoal">
                  {format(t.tierItemTitle, { n: index + 1 })}
                </h3>
                <IconButton
                  icon={TrashIcon}
                  tone="danger"
                  label={format(t.removeTier, { n: index + 1 })}
                  className="-mr-2"
                  onClick={() => removeTier(index)}
                />
              </div>
              <div className="mt-2 grid gap-4 sm:grid-cols-3">
                <InputField
                  id={fieldId(`priceTiers.${index}.from`)}
                  label={t.tierFrom}
                  required
                  error={err(`priceTiers.${index}.from`)}
                  inputMode="numeric"
                  autoComplete="off"
                  value={tier.from}
                  onChange={(v) => setTier(index, "from", v)}
                />
                <InputField
                  id={fieldId(`priceTiers.${index}.to`)}
                  label={t.tierTo}
                  hint={t.tierToHint}
                  error={err(`priceTiers.${index}.to`)}
                  inputMode="numeric"
                  autoComplete="off"
                  value={tier.to}
                  onChange={(v) => setTier(index, "to", v)}
                />
                <InputField
                  id={fieldId(`priceTiers.${index}.amount`)}
                  label={t.tierAmount}
                  required
                  error={err(`priceTiers.${index}.amount`)}
                  inputMode="decimal"
                  autoComplete="off"
                  value={tier.amount}
                  onChange={(v) => setTier(index, "amount", v)}
                />
              </div>
            </li>
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
