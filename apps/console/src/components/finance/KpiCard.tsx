export interface KpiCardProps {
  label: string;
  /** Already formatted. */
  value: string;
  /** Optional one-line explanation under the value. */
  hint?: string;
}

/** One headline number with a short explanation. */
export function KpiCard({ label, value, hint }: KpiCardProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-white p-4 shadow-sm">
      <dt className="text-sm font-medium text-ink">{label}</dt>
      <dd className="mt-1 break-words font-display text-xl font-semibold tabular-nums text-charcoal">{value}</dd>
      {hint && <dd className="mt-1 text-sm text-ink">{hint}</dd>}
    </div>
  );
}

export default KpiCard;
