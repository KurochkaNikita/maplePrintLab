import type { FinanceOption } from "@maple-print-lab/db";
import LookupEditor from "@/components/lookup-editor/LookupEditor";
import PageHeader from "@/components/PageHeader";
import type { Dictionary } from "@/lib/i18n";

export interface ListsScreenProps {
  t: Dictionary;
  channels: FinanceOption[];
  categories: FinanceOption[];
}

/** Pick-lists used by the order and expense forms. */
export function ListsScreen({ t, channels, categories }: ListsScreenProps) {
  const p = t.pages.lists;

  return (
    <div className="space-y-8">
      <PageHeader title={p.heading} description={p.description} />
      <div className="grid gap-6 lg:grid-cols-2">
        <LookupEditor kind="channel" items={channels} {...p.channels} />
        <LookupEditor kind="expense_category" items={categories} {...p.categories} />
      </div>
    </div>
  );
}

export default ListsScreen;
