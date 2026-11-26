import Link from "next/link";

export interface CounterCardProps {
  label: string;
  value: number;
  /** Makes the whole card a link. */
  href?: string;
}

const card = "block h-full rounded-2xl border border-line bg-white p-4 shadow-sm";

/** One thing to act on and how many there are. */
export function CounterCard({ label, value, href }: CounterCardProps) {
  const body = (
    <>
      <span className="block font-display text-2xl font-semibold tabular-nums text-charcoal">{value}</span>
      <span className={`mt-1 block text-sm font-medium ${href ? "text-amber-deep underline underline-offset-4" : "text-ink"}`}>{label}</span>
    </>
  );

  return href ? (
    <Link href={href} className={`${card} transition-colors hover:border-charcoal`}>
      {body}
    </Link>
  ) : (
    <div className={card}>{body}</div>
  );
}

export default CounterCard;
