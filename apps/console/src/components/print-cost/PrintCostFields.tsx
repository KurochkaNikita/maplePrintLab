"use client";

import type { ReactNode } from "react";
import { PRINTER_IDS } from "@maple-print-lab/db/src/print-job";
import { useT } from "@/components/LocaleProvider";
import SelectField from "@/components/SelectField";
import { PRINTERS } from "@/lib/print-cost/rates";
import type { PrintCostField, PrintCostValues } from "@/lib/print-cost/types";
import CostBlock, { type CostBlockVariant } from "./CostBlock";
import PrintJobInputs from "./PrintJobInputs";

export interface PrintCostFieldsProps {
  /** DOM id of the input of one field. */
  idFor: (field: PrintCostField) => string;
  values: PrintCostValues;
  errorFor: (field: PrintCostField) => string | undefined;
  onChange: (values: PrintCostValues) => void;
  /** The hand-typed cost field, shown while no printer is chosen. */
  manual: ReactNode;
  variant?: CostBlockVariant;
  className?: string;
}

/** Cost of one piece: a printer picks the calculator, otherwise the cost is typed in by hand. */
export function PrintCostFields({ idFor, values, errorFor, onChange, manual, variant = "card", className = "" }: PrintCostFieldsProps) {
  const t = useT().printCost;

  return (
    <CostBlock title={t.blockTitle} variant={variant} className={className}>
      <div className="space-y-4">
        <SelectField
          id={idFor("printer")}
          label={t.printerLabel}
          tip={t.printerHint}
          error={errorFor("printer")}
          className="max-w-sm"
          value={values.printer}
          onChange={(printer) => onChange({ ...values, printer })}
        >
          <option value="">{t.printerManual}</option>
          {PRINTER_IDS.map((id) => (
            <option key={id} value={id}>
              {PRINTERS[id].name}
            </option>
          ))}
        </SelectField>
        {values.printer ? (
          <PrintJobInputs idFor={idFor} values={values} errorFor={errorFor} onChange={onChange} />
        ) : (
          manual
        )}
      </div>
    </CostBlock>
  );
}

export default PrintCostFields;
