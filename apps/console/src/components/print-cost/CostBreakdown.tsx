"use client";

import type { PrintJob } from "@maple-print-lab/db/src/print-job";
import { useLocale, useT } from "@/components/LocaleProvider";
import { formatMoney } from "@/lib/finance/format";
import { totalCost } from "@/lib/print-cost/calc";
import { printCostRows } from "@/lib/print-cost/rows";
import CostRow from "./CostRow";

export interface CostBreakdownProps {
  job: PrintJob;
}

/** What one piece costs, line by line. */
export function CostBreakdown({ job }: CostBreakdownProps) {
  const t = useT().printCost;
  const locale = useLocale();

  return (
    <div className="rounded-xl border border-line bg-filament p-4">
      <p className="text-sm font-semibold text-charcoal">{t.breakdownTitle}</p>
      <dl className="mt-2 space-y-1">
        {printCostRows(job, t, locale).map((row) => (
          <CostRow key={row.id} label={row.label} value={row.value} />
        ))}
        <CostRow label={t.total} value={formatMoney(totalCost(job), locale)} strong />
      </dl>
    </div>
  );
}

export default CostBreakdown;
