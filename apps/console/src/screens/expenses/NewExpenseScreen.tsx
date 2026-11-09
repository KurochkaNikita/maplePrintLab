import type { FinanceOption } from "@maple-print-lab/db";
import BackLink from "@/components/BackLink";
import ExpenseForm from "@/components/expense-form/ExpenseForm";
import PageHeader from "@/components/PageHeader";
import { emptyExpenseValues } from "@/lib/finance/form-values";
import type { Dictionary } from "@/lib/i18n";

export interface NewExpenseScreenProps {
  t: Dictionary;
  categories: FinanceOption[];
  /** Today (YYYY-MM-DD) in the shop's time zone, prefilled as the date. */
  today: string;
}

export function NewExpenseScreen({ t, categories, today }: NewExpenseScreenProps) {
  const p = t.pages.expenses;

  return (
    <div className="space-y-6">
      <BackLink href="/expenses">{p.backToList}</BackLink>
      <PageHeader title={p.new.heading} description={p.new.description} />
      <ExpenseForm target={{ mode: "create" }} initialValues={emptyExpenseValues(today)} categories={categories} />
    </div>
  );
}

export default NewExpenseScreen;
