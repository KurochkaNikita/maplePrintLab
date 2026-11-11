export interface KpiCardProps {
  label: string;
  /** Already formatted. */
  value: string;
  /** Optional one-line explanation under the value. */
  hint?: string;
  /** Smaller value text, for rows of many tiles or long values such as dates. */
  compact?: boolean;
}

/** One headline number with a short explanation. */
export function KpiCard({ label, value, hint, compact = false }: KpiCardProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
      <dt className="text-sm font-medium text-ink">{label}</dt>
      <dd className={`mt-1 break-words font-display font-semibold tabular-nums text-charcoal ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>{value}</dd>
      {hint && <dd className="mt-1 text-sm text-ink">{hint}</dd>}
    </div>
  );
}

export default KpiCard;
