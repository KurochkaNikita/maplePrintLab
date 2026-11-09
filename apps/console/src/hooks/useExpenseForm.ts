"use client";

import type { FinanceOption } from "@maple-print-lab/db";
import { createExpense, updateExpense } from "@/lib/finance/actions";
import type { ExpenseFormValues } from "@/lib/finance/types";
import { validateExpense } from "@/lib/finance/validation";
import { useFinanceForm } from "./useFinanceForm";

export type ExpenseFormTarget = { mode: "create" } | { mode: "edit"; expenseId: number };

export interface UseExpenseFormOptions {
  target: ExpenseFormTarget;
  initialValues: ExpenseFormValues;
  categories: FinanceOption[];
  justCreated?: boolean;
}

export function useExpenseForm({ target, initialValues, categories, justCreated }: UseExpenseFormOptions) {
  const form = useFinanceForm<ExpenseFormValues>({
    initialValues,
    idPrefix: "ef",
    justCreated,
    validate: (values) => {
      const result = validateExpense(values, { categoryExists: categories.some((c) => String(c.id) === values.categoryId.trim()) });
      return "errors" in result ? result.errors : null;
    },
    save: (values) => (target.mode === "create" ? createExpense(values) : updateExpense(target.expenseId, values)),
    getCreatedUrl: target.mode === "create" ? (id) => `/expenses/${id}?created=1` : null,
  });
  const { values, change } = form;

  const setField = (field: keyof ExpenseFormValues, value: string) => change({ ...values, [field]: value }, field);

  return { ...form, setField, isEdit: target.mode === "edit" };
}
