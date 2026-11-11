import type { PriceTier } from "@maple-print-lab/db/src/schema";
import { formatMoney } from "@/lib/finance/format";
import { format, type Dictionary, type Locale } from "@/lib/i18n";

export interface PriceTiersTableProps {
  t: Dictionary["pages"]["products"]["view"]["info"];
  locale: Locale;
  tiers: PriceTier[];
}

/** Volume pricing: quantity range and price per piece. */
export function PriceTiersTable({ t, locale, tiers }: PriceTiersTableProps) {
  return (
    <table className="text-sm">
      <caption className="visually-hidden">{t.tiersLabel}</caption>
      <thead>
        <tr className="text-left text-ink">
          <th scope="col" className="py-1 pr-8 font-medium">{t.tierQuantity}</th>
          <th scope="col" className="py-1 font-medium">{t.tierPrice}</th>
        </tr>
      </thead>
      <tbody>
        {tiers.map((tier) => (
          <tr key={tier.from}>
            <td className="py-1 pr-8 tabular-nums">
              {tier.to === undefined ? format(t.tierOpen, { from: tier.from }) : format(t.tierRange, { from: tier.from, to: tier.to })}
            </td>
            <td className="py-1 tabular-nums">{formatMoney(tier.amount, locale)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PriceTiersTable;
