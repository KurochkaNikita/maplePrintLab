import type { OrderLabels } from "@/lib/order/types";
import { fill } from "@/lib/order/format";

type QuantityStepperProps = {
  value: number;
  min?: number;
  max: number;
  /** Name of the piece, spoken in the button labels. */
  title: string;
  labels: OrderLabels["line"];
  onChange: (value: number) => void;
};

const BUTTON =
  "flex h-11 w-11 items-center justify-center text-xl text-charcoal hover:bg-charcoal/5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-deep";

/** "−  2  +" control for the quantity of one piece. */
export default function QuantityStepper({ value, min = 1, max, title, labels, onChange }: QuantityStepperProps) {
  return (
    <div role="group" aria-label={`${labels.quantity}: ${title}`} className="inline-flex items-center overflow-hidden rounded-full border border-line bg-white">
      <button type="button" aria-label={fill(labels.decrease, { title })} disabled={value <= min} onClick={() => onChange(value - 1)} className={BUTTON}>
        <span aria-hidden="true">−</span>
      </button>
      <span className="min-w-8 text-center font-mono text-sm tabular-nums text-charcoal">{value}</span>
      <button type="button" aria-label={fill(labels.increase, { title })} disabled={value >= max} onClick={() => onChange(value + 1)} className={BUTTON}>
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
