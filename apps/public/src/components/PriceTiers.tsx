import { formatAmount } from "@/lib/price";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { PriceTier } from "@/db";

type PriceTiersProps = {
  lang: Locale;
  dict: Dictionary;
  tiers: PriceTier[];
  className?: string;
};

/** Volume-price table: order size → price per piece (CAD). */
export default function PriceTiers({ lang, dict, tiers, className = "" }: PriceTiersProps) {
  const t = dict.priceTiers;
  const last = tiers[tiers.length - 1];

  return (
    <section className={className} aria-label={t.heading}>
      <h2 className="font-mono text-xs uppercase tracking-wider text-teal">{t.heading}</h2>
      <table className="mt-3 w-full max-w-md border-y border-line text-left">
        <thead className="sr-only">
          <tr>
            <th scope="col">{t.quantityHeader}</th>
            <th scope="col">{t.priceHeader}</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier) => (
            <tr key={tier.from} className="border-b border-line last:border-b-0">
              <th scope="row" className="py-2.5 pr-4 font-normal text-ink/80">
                {tier.to ? `${tier.from}–${tier.to}` : `${tier.from}+`} {t.quantityUnit}
              </th>
              <td className="py-2.5 text-right font-display text-charcoal">
                {formatAmount(tier.amount, "CAD", lang, true)} {dict.price.currencySuffix}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {last.to && (
        <p className="mt-2 max-w-md text-sm text-ink/80">
          {t.moreNote.replace("{max}", String(last.to))}
        </p>
      )}
    </section>
  );
}
