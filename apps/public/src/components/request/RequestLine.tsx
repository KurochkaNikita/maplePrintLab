import Image from "next/image";
import { MAX_QUANTITY, type CartLine } from "@/lib/cart/store";
import { fill } from "@/lib/order/format";
import type { CartCatalogEntry, OrderLabels } from "@/lib/order/types";
import QuantityStepper from "./QuantityStepper";

type RequestLineProps = {
  line: CartLine;
  /** Undefined when the piece is no longer in the catalogue. */
  entry?: CartCatalogEntry;
  /** The server said this piece can no longer be requested. */
  unavailable: boolean;
  labels: OrderLabels["line"];
  onQuantity: (slug: string, quantity: number) => void;
  onRemove: (slug: string) => void;
};

/** One piece of the request: photo, name, price, quantity and a remove button. */
export default function RequestLine({ line, entry, unavailable, labels, onQuantity, onRemove }: RequestLineProps) {
  const title = entry?.title ?? line.slug;
  const gone = !entry || unavailable;

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
      {entry?.image ? (
        <Image src={entry.image.src} alt={entry.image.alt} width={entry.image.width} height={entry.image.height} sizes="64px" className="h-16 w-16 shrink-0 rounded-lg border border-line object-cover" />
      ) : (
        <div aria-hidden="true" className="h-16 w-16 shrink-0 rounded-lg border border-line bg-filament" />
      )}

      <div className="min-w-0 flex-1 basis-40">
        <p className="font-display text-base font-semibold text-charcoal">{title}</p>
        {entry && (
          <p className="text-sm text-charcoal">
            {entry.price} <span className="text-ink">{labels.each}</span>
          </p>
        )}
        {gone && <p className="mt-1 text-sm font-medium text-red-700">{labels.unavailable}</p>}
      </div>

      <div className="flex items-center gap-2">
        <QuantityStepper value={line.quantity} max={MAX_QUANTITY} title={title} labels={labels} onChange={(quantity) => onQuantity(line.slug, quantity)} />
        <button
          type="button"
          aria-label={fill(labels.removeAria, { title })}
          onClick={() => onRemove(line.slug)}
          className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-charcoal underline underline-offset-4 hover:text-amber-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-deep"
        >
          {labels.remove}
        </button>
      </div>
    </li>
  );
}
