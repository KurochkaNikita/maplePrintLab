export interface KpiCardProps {
  label: string;
  /** Already formatted. */
  value: string;
  hint: string;
}

/** One headline number with a short explanation. */
export function KpiCard({ label, value, hint }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
      <dt className="text-sm font-medium text-ink">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-charcoal sm:text-3xl">{value}</dd>
      <dd className="mt-1 text-sm text-ink">{hint}</dd>
    </div>
  );
}

export default KpiCard;
