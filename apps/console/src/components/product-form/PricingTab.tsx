"use client";

import Checkbox from "@/components/Checkbox";
import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import Switch from "@/components/Switch";
import { useProductFormContext } from "@/hooks/useProductFormContext";
import { fieldId } from "@/lib/products/types";
import PriceTiersEditor from "./PriceTiersEditor";
import ProductCostSection from "./ProductCostSection";
import ProductPriceComparison from "./ProductPriceComparison";
import { errorText } from "./shared";

/** First our cost of one piece, then the selling price, then how it compares. */
export function PricingTab() {
  const { values, errors, change: onChange } = useProductFormContext();
  const dict = useT();
  const t = dict.pages.products.form.pricing;
  const err = (key: string) => errorText(errors, key, dict);

  return (
    <div className="space-y-8">
      <ProductCostSection />

      <Switch
        label={t.modeTiers}
        hint={t.modeTiersHint}
        checked={values.priceMode === "tiers"}
        onChange={(e) =>
          onChange({ ...values, priceMode: e.target.checked ? "tiers" : "single" }, "priceAmount", "priceTiers")
        }
      />

      {values.priceMode === "single" ? (
        <div className="max-w-sm space-y-2">
          <InputField
            id={fieldId("priceAmount")}
            label={t.priceLabel}
            required
            hint={t.priceHint}
            error={err("priceAmount")}
            name="priceAmount"
            inputMode="decimal"
            autoComplete="off"
            value={values.priceAmount}
            onChange={(v) => onChange({ ...values, priceAmount: v }, "priceAmount")}
          />
          <Checkbox
            label={t.priceFromLabel}
            hint={t.priceFromHint}
            checked={values.priceFrom}
            onChange={(e) => onChange({ ...values, priceFrom: e.target.checked })}
          />
        </div>
      ) : (
        <PriceTiersEditor />
      )}

      <ProductPriceComparison />
    </div>
  );
}

export default PricingTab;
