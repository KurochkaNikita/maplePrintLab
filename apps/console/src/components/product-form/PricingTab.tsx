"use client";

import { useRef } from "react";
import Checkbox from "@/components/Checkbox";
import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import { DIMENSION_AXES, DIMENSION_UNITS, convertLength, type DimensionUnit } from "@/lib/products/dimensions";
import { fieldId } from "@/lib/products/types";
import { errorText, withDimension, type TabProps } from "./shared";

export interface PricingTabProps extends TabProps {
  /** The chosen category has volume pricing, so the product has no price of its own. */
  categoryHasPriceTiers: boolean;
}

export function PricingTab({ values, errors, onChange, categoryHasPriceTiers }: PricingTabProps) {
  const dict = useT();
  const t = dict.pages.products.form.pricing;
  const err = (key: string) => errorText(errors, key, dict);
  // Value when a size field gained focus: the other unit is recalculated only if it changed.
  const onFocusValue = useRef("");

  /**
   * Keeps the units in step (cm <-> in) after the user leaves a size field, but never overwrites
   * a hand-set value (e.g. 10 in) just because the field was visited.
   */
  function syncOtherUnit(unit: DimensionUnit, index: number, value: string) {
    if (value === onFocusValue.current) return;
    const other = unit === "cm" ? "in" : "cm";
    const converted = convertLength(value, unit);
    if (converted !== null) {
      onChange(withDimension(values, other, index, converted), `dimensions.${other}.${index}`);
    }
  }

  return (
    <div className="space-y-8">
      <InputField
        id={fieldId("material")}
        label={t.materialLabel}
        required
        hint={t.materialHint}
        error={err("material")}
        className="max-w-sm"
        name="material"
        value={values.material}
        onChange={(v) => onChange({ ...values, material: v }, "material")}
      />

      {categoryHasPriceTiers ? (
        <p className="rounded-lg border border-line bg-white px-4 py-3 text-sm text-charcoal">{t.priceFromTiers}</p>
      ) : (
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
      )}

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-semibold text-charcoal">{t.dimensionsLabel}</legend>
        <p className="text-sm text-ink">{t.dimensionsHint}</p>

        <div className="grid gap-6 lg:grid-cols-2">
          {DIMENSION_UNITS.map((unit) => (
            <fieldset key={unit} className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-6">
              <legend className="px-2 text-sm font-semibold text-charcoal">{unit === "cm" ? t.cm : t.inch}</legend>
              <div className="grid grid-cols-3 gap-3">
                {DIMENSION_AXES.map((axis, index) => {
                  const key = `dimensions.${unit}.${index}`;
                  return (
                    <InputField
                      key={axis}
                      id={fieldId(key)}
                      label={t[axis]}
                      required
                      error={err(key)}
                      inputMode="decimal"
                      autoComplete="off"
                      value={values.dimensions[unit][index]}
                      onChange={(v) => onChange(withDimension(values, unit, index, v), key)}
                      onFocus={(e) => (onFocusValue.current = e.target.value)}
                      onBlur={(e) => syncOtherUnit(unit, index, e.target.value)}
                    />
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export default PricingTab;
