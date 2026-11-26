import type { PriceCard } from "@/lib/print-cost/comparison";

export type PriceCardItemProps = Omit<PriceCard, "id">;

/** One price of the comparison, shown large. */
export function PriceCardItem({ label, amount, details, highlighted }: PriceCardItemProps) {
  return (
    <div className={`rounded-xl bg-white p-4 ${highlighted ? "border-2 border-charcoal" : "border border-line"}`}>
      <dt className="text-sm font-semibold text-charcoal">{label}</dt>
      <dd>
        <span className="block font-display text-2xl font-semibold tabular-nums text-charcoal">{amount}</span>
        {details.map((detail) => (
          <span key={detail} className="block text-sm text-ink">
            {detail}
          </span>
        ))}
      </dd>
    </div>
  );
}

export default PriceCardItem;
