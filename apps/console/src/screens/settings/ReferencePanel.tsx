import type { FinanceOption } from "@maple-print-lab/db";
import LookupEditor from "@/components/lookup-editor/LookupEditor";
import type { Dictionary } from "@/lib/i18n";

export interface ReferencePanelProps {
  p: Dictionary["pages"]["settings"];
  channels: FinanceOption[];
  categories: FinanceOption[];
}

/** Pick-lists (sales sources, expense categories). */
export function ReferencePanel({ p, channels, categories }: ReferencePanelProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-ink">{p.description}</p>
      <LookupEditor kind="channel" items={channels} {...p.channels} />
      <LookupEditor kind="expense_category" items={categories} {...p.categories} />
    </div>
  );
}

export default ReferencePanel;
