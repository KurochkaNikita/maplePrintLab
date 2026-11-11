"use client";

import type { ReactNode } from "react";
import type { FinanceOption } from "@maple-print-lab/db";
import FormActionBar from "@/components/FormActionBar";
import FormError from "@/components/FormError";
import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import SelectField from "@/components/SelectField";
import { useExpenseForm, type ExpenseFormTarget } from "@/hooks/useExpenseForm";
import { errorText } from "@/lib/finance/error-text";
import { fieldId, type ExpenseFormValues } from "@/lib/finance/types";
import { format } from "@/lib/i18n";

export interface ExpenseFormProps {
  target: ExpenseFormTarget;
  initialValues: ExpenseFormValues;
  categories: FinanceOption[];
  /** Extra controls on the right of the save bar, e.g. a delete button. */
  actions?: ReactNode;
}

const ERROR_ID = "expense-form-error";

/** Create/edit form of an expense: date, category, what for and how much. */
export function ExpenseForm({ target, initialValues, categories, actions }: ExpenseFormProps) {
  const dict = useT();
  const t = dict.pages.expenses.form;
  const f = useExpenseForm({ target, initialValues, categories });
  const { values, errors } = f;
  const err = (key: string) => errorText(errors, key, dict);

  const banner = f.errorTotal ? format(t.errorSummary, { count: f.errorTotal }) : null;
  const submitLabel = f.saving ? t.actions.saving : f.isEdit ? t.actions.save : t.actions.create;

  return (
    <form onSubmit={f.submit} noValidate className="space-y-6">
      <FormError id={ERROR_ID} message={banner} />

      <div className="grid gap-6 rounded-2xl border border-line bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-6">
        <InputField
          id={fieldId("ef", "spentOn")}
          type="date"
          label={t.dateLabel}
          required
          error={err("spentOn")}
          value={values.spentOn}
          onChange={(v) => f.setField("spentOn", v)}
        />
        <SelectField
          id={fieldId("ef", "categoryId")}
          label={t.categoryLabel}
          required
          hint={t.categoryHint}
          error={err("categoryId")}
          value={values.categoryId}
          onChange={(v) => f.setField("categoryId", v)}
        >
          <option value="">{t.categoryPlaceholder}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <InputField
          id={fieldId("ef", "description")}
          label={t.descriptionLabel}
          required
          hint={t.descriptionHint}
          error={err("description")}
          autoComplete="off"
          value={values.description}
          onChange={(v) => f.setField("description", v)}
        />
        <InputField
          id={fieldId("ef", "amount")}
          label={t.amountLabel}
          required
          error={err("amount")}
          inputMode="decimal"
          autoComplete="off"
          value={values.amount}
          onChange={(v) => f.setField("amount", v)}
        />
      </div>

      <FormActionBar
        submitLabel={submitLabel}
        saving={f.saving}
        cancelHref="/expenses"
        cancelLabel={dict.pages.expenses.backToList}
      >
        {actions}
      </FormActionBar>
    </form>
  );
}

export default ExpenseForm;
