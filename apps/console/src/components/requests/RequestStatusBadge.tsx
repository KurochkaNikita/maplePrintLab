import type { OrderRequestStatus } from "@/lib/order-requests/params";

export interface RequestStatusBadgeProps {
  status: OrderRequestStatus;
  /** Translated name of the status: the meaning is always in the text, the colour only supports it. */
  label: string;
}

const tones: Record<OrderRequestStatus, string> = {
  new: "border-amber-deep bg-amber-deep text-white",
  replied: "border-charcoal/40 bg-white text-charcoal",
  converted: "border-charcoal bg-charcoal text-filament",
  spam: "border-ink/50 bg-filament text-ink",
  closed: "border-ink/50 bg-filament text-ink",
};

/** Status of a request as a pill with its name. */
export function RequestStatusBadge({ status, label }: RequestStatusBadgeProps) {
  return <span className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[status]}`}>{label}</span>;
}

export default RequestStatusBadge;
