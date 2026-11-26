export interface CostRowProps {
  label: string;
  value: string;
  strong?: boolean;
}

/** One line of the cost breakdown. */
export function CostRow({ label, value, strong = false }: CostRowProps) {
  return (
    <div className={`flex justify-between gap-4 text-sm text-charcoal ${strong ? "border-t border-line pt-2 font-semibold" : ""}`.trim()}>
      <dt>{label}</dt>
      <dd className="whitespace-nowrap tabular-nums">{value}</dd>
    </div>
  );
}

export default CostRow;
