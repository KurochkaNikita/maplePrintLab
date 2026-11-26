"use client";

import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import { parsePrintCost } from "@/lib/print-cost/values";
import CostBreakdown from "./CostBreakdown";
import type { PrintCostFieldsProps } from "./PrintCostFields";

export type PrintJobInputsProps = Pick<PrintCostFieldsProps, "idFor" | "values" | "errorFor" | "onChange">;

/** Print time, plastic and other costs of one piece, with the estimate under them. */
export function PrintJobInputs({ idFor, values, errorFor, onChange }: PrintJobInputsProps) {
  const t = useT().printCost;
  const result = parsePrintCost(values);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          id={idFor("hours")}
          label={t.hoursLabel}
          required
          tip={t.timeHint}
          error={errorFor("hours")}
          inputMode="numeric"
          autoComplete="off"
          value={values.hours}
          onChange={(hours) => onChange({ ...values, hours })}
        />
        <InputField
          id={idFor("minutes")}
          label={t.minutesLabel}
          error={errorFor("minutes")}
          inputMode="numeric"
          autoComplete="off"
          value={values.minutes}
          onChange={(minutes) => onChange({ ...values, minutes })}
        />
        <InputField
          id={idFor("plastic")}
          label={t.plasticLabel}
          required
          tip={t.plasticHint}
          error={errorFor("plastic")}
          inputMode="decimal"
          autoComplete="off"
          value={values.plastic}
          onChange={(plastic) => onChange({ ...values, plastic })}
        />
        <InputField
          id={idFor("other")}
          label={t.otherLabel}
          tip={t.otherHint}
          error={errorFor("other")}
          inputMode="decimal"
          autoComplete="off"
          value={values.other}
          onChange={(other) => onChange({ ...values, other })}
        />
      </div>
      {"job" in result ? (
        <CostBreakdown job={result.job} />
      ) : (
        <p className="text-sm text-ink">{t.incomplete}</p>
      )}
    </>
  );
}

export default PrintJobInputs;
