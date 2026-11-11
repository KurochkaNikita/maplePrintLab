import type { ExpenseRecord, FinanceOption } from "@maple-print-lab/db";
import BackLink from "@/components/BackLink";
import ConfirmDelete from "@/components/ConfirmDelete";
import ExpenseForm from "@/components/expense-form/ExpenseForm";
import PageHeader from "@/components/PageHeader";
import { deleteExpense } from "@/lib/finance/actions";
import { formatDate } from "@/lib/finance/format";
import { toExpenseFormValues } from "@/lib/finance/form-values";
import { format, type Dictionary, type Locale } from "@/lib/i18n";

export interface EditExpenseScreenProps {
  t: Dictionary;
  locale: Locale;
  expense: ExpenseRecord;
  categories: FinanceOption[];
}

export function EditExpenseScreen({ t, locale, expense, categories }: EditExpenseScreenProps) {
  const p = t.pages.expenses;
  const date = formatDate(expense.spentOn, locale);

  return (
    <div className="space-y-6">
      <BackLink href="/expenses">{p.backToList}</BackLink>
      <PageHeader title={format(p.edit.heading, { date })} description={p.edit.description} />
      <ExpenseForm
        target={{ mode: "edit", expenseId: expense.id }}
        initialValues={toExpenseFormValues(expense)}
        categories={categories}
        actions={
          <ConfirmDelete
            labels={{ ...p.delete, title: format(p.delete.title, { date }) }}
            errors={t.pages.finance.formErrors}
            action={deleteExpense.bind(null, expense.id)}
            successMessage={p.delete.done}
            redirectTo="/expenses"
          />
        }
      />
    </div>
  );
}

export default EditExpenseScreen;
