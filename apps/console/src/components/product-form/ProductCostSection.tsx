"use client";

import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import PrintCostFields from "@/components/print-cost/PrintCostFields";
import { useProductFormContext } from "@/hooks/useProductFormContext";
import { PRINT_COST_FIELDS } from "@/lib/print-cost/types";
import { fieldId } from "@/lib/products/types";
import { errorText } from "./shared";

/** Our cost of one piece, calculated from the print or typed in. */
export function ProductCostSection() {
  const { values, errors, change } = useProductFormContext();
  const dict = useT();
  const t = dict.pages.products.form.pricing;
  const err = (key: string) => errorText(errors, key, dict);

  return (
    <PrintCostFields
      className="max-w-2xl"
      idFor={(field) => fieldId(`print.${field}`)}
      values={values.print}
      errorFor={(field) => err(`print.${field}`)}
      onChange={(print) => change({ ...values, print }, ...PRINT_COST_FIELDS.map((field) => `print.${field}`))}
      manual={
        <InputField
          id={fieldId("costAmount")}
          label={t.cost.label}
          hint={t.cost.hint}
          error={err("costAmount")}
          className="max-w-sm"
          name="costAmount"
          inputMode="decimal"
          autoComplete="off"
          value={values.costAmount}
          onChange={(v) => change({ ...values, costAmount: v }, "costAmount")}
        />
      }
    />
  );
}

export default ProductCostSection;
