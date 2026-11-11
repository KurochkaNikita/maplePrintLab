"use client";

import type { FinanceOption } from "@maple-print-lab/db";
import { useT } from "@/components/LocaleProvider";
import { createExpense, updateExpense } from "@/lib/finance/actions";
import type { ExpenseFormValues } from "@/lib/finance/types";
import { validateExpense } from "@/lib/finance/validation";
import { useFinanceForm } from "./useFinanceForm";

export type ExpenseFormTarget = { mode: "create" } | { mode: "edit"; expenseId: number };

export interface UseExpenseFormOptions {
  target: ExpenseFormTarget;
  initialValues: ExpenseFormValues;
  categories: FinanceOption[];
}

export function useExpenseForm({ target, initialValues, categories }: UseExpenseFormOptions) {
  const t = useT().pages.expenses.form;
  const form = useFinanceForm<ExpenseFormValues>({
    initialValues,
    idPrefix: "ef",
    validate: (values) => {
      const result = validateExpense(values, { categoryExists: categories.some((c) => String(c.id) === values.categoryId.trim()) });
      return "errors" in result ? result.errors : null;
    },
    save: (values) => (target.mode === "create" ? createExpense(values) : updateExpense(target.expenseId, values)),
    resetAfterSave: target.mode === "create",
    messages: { created: t.status.created, saved: t.status.saved },
  });
  const { values, change } = form;

  const setField = (field: keyof ExpenseFormValues, value: string) => change({ ...values, [field]: value }, field);

  return { ...form, setField, isEdit: target.mode === "edit" };
}
