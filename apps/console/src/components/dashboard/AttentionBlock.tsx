import type { OrderStageCounts } from "@maple-print-lab/db";
import CounterCard from "@/components/dashboard/CounterCard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import type { Dictionary } from "@/lib/i18n";
import { requestsHref } from "@/lib/order-requests/params";

export interface AttentionBlockProps {
  t: Dictionary["pages"]["dashboard"]["attention"];
  newRequests: number;
  stages: OrderStageCounts;
}

/** What waits for us: new enquiries, orders to hand over and orders being made. */
export function AttentionBlock({ t, newRequests, stages }: AttentionBlockProps) {
  return (
    <DashboardSection id="attention-heading" title={t.title}>
      <ul className="grid gap-4 sm:grid-cols-3">
        <li>
          <CounterCard label={t.newRequests} value={newRequests} href={requestsHref("new")} />
        </li>
        <li>
          <CounterCard label={t.ready} value={stages.done} />
        </li>
        <li>
          <CounterCard label={t.inProgress} value={stages.inProgress} />
        </li>
      </ul>
    </DashboardSection>
  );
}

export default AttentionBlock;
