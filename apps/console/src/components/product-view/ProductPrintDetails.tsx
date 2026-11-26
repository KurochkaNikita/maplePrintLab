import type { PrintJob } from "@maple-print-lab/db";
import type { Locale } from "@/lib/i18n";
import type { PrintCostStrings } from "@/lib/i18n/print-cost/ru";
import { formatMoney } from "@/lib/finance/format";
import { suggestedPrices, totalCost } from "@/lib/print-cost/calc";
import { PRINTERS } from "@/lib/print-cost/rates";
import { printCostRows } from "@/lib/print-cost/rows";

export interface ProductPrintDetailsProps {
  t: PrintCostStrings;
  locale: Locale;
  job: PrintJob;
}

/** How the saved cost was calculated: printer, time, each part and the suggested prices. */
export function ProductPrintDetails({ t, locale, job }: ProductPrintDetailsProps) {
  const prices = suggestedPrices(totalCost(job));
  const time = `${Math.floor(job.minutes / 60)}:${String(job.minutes % 60).padStart(2, "0")}`;

  return (
    <ul className="mt-1 space-y-0.5 text-ink">
      <li>
        {PRINTERS[job.printer].name}, {time}
      </li>
      {printCostRows(job, t, locale).map((row) => (
        <li key={row.id}>
          {row.label}: {row.value}
        </li>
      ))}
      <li className="font-medium text-charcoal">
        {t.minimum}: {formatMoney(prices.minimum, locale)}
      </li>
      <li className="font-medium text-charcoal">
        {t.recommended}: {formatMoney(prices.recommended, locale)}
      </li>
    </ul>
  );
}

export default ProductPrintDetails;
