"use client";

import type { ReactNode } from "react";
import type { FinanceOption, ProductSaleOption } from "@maple-print-lab/db";
import Button from "@/components/Button";
import FormActionBar from "@/components/FormActionBar";
import FormError from "@/components/FormError";
import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import SelectField from "@/components/SelectField";
import TextareaField from "@/components/TextareaField";
import { useOrderForm, type OrderFormTarget } from "@/hooks/useOrderForm";
import { errorText } from "@/lib/finance/error-text";
import { fieldId, type OrderFormValues } from "@/lib/finance/types";
import { format } from "@/lib/i18n";
import OrderItemCard from "./OrderItemCard";
import OrderTotals from "./OrderTotals";

export interface OrderFormProps {
  target: OrderFormTarget;
  initialValues: OrderFormValues;
  channels: FinanceOption[];
  /** Catalogue products that can be picked as order lines. */
  products: ProductSaleOption[];
  /** The page was reached right after creating the order. */
  justCreated?: boolean;
  /** Extra controls on the right of the save bar, e.g. a delete button. */
  actions?: ReactNode;
}

const ERROR_ID = "order-form-error";

/** Create/edit form of an order: date, source, note and the list of lines with price and our cost. */
export function OrderForm({ target, initialValues, channels, products, justCreated, actions }: OrderFormProps) {
  const dict = useT();
  const t = dict.pages.orders.form;
  const f = useOrderForm({ target, initialValues, channels, products, justCreated });
  const { values, errors, change } = f;
  const err = (key: string) => errorText(errors, key, dict);

  const banner = f.formError ? dict.pages.finance.formErrors[f.formError] : f.errorTotal ? format(t.errorSummary, { count: f.errorTotal }) : null;
  const submitLabel = f.saving ? t.actions.saving : f.isEdit ? t.actions.save : t.actions.create;
  const itemsError = err("items");

  return (
    <form onSubmit={f.submit} noValidate className="space-y-6">
      <FormError id={ERROR_ID} message={banner} />

      <div className="grid gap-6 rounded-2xl border border-line bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-6">
        <InputField
          id={fieldId("of", "orderedOn")}
          type="date"
          label={t.dateLabel}
          required
          error={err("orderedOn")}
          value={values.orderedOn}
          onChange={(v) => change({ ...values, orderedOn: v }, "orderedOn")}
        />
        <SelectField
          id={fieldId("of", "channelId")}
          label={t.channelLabel}
          required
          hint={t.channelHint}
          error={err("channelId")}
          value={values.channelId}
          onChange={(v) => change({ ...values, channelId: v }, "channelId")}
        >
          <option value="">{t.channelPlaceholder}</option>
          {channels.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <TextareaField
          id={fieldId("of", "note")}
          label={t.noteLabel}
          hint={t.noteHint}
          error={err("note")}
          className="sm:col-span-2"
          rows={2}
          value={values.note}
          onChange={(v) => change({ ...values, note: v }, "note")}
        />
      </div>

      <fieldset className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-6">
        <legend className="px-2 font-display text-lg font-semibold text-charcoal">{t.items.legend}</legend>
        <ul className="space-y-6">
          {values.items.map((item, index) => (
            <OrderItemCard
              key={index}
              index={index}
              item={item}
              errors={errors}
              products={products}
              onChange={f.setItem}
              onPickProduct={f.pickProduct}
              onRemove={f.removeItem}
            />
          ))}
        </ul>
        <Button id={fieldId("of", "items")} type="button" variant="secondary" size="sm" className="mt-4" onClick={f.addItem}>
          {t.items.add}
        </Button>
        {itemsError && (
          <p role="alert" className="mt-2 text-sm font-medium text-amber-deep">
            {itemsError}
          </p>
        )}
      </fieldset>

      <OrderTotals {...f.totals} />

      <FormActionBar
        submitLabel={submitLabel}
        saving={f.saving}
        cancelHref="/orders"
        cancelLabel={dict.pages.orders.backToList}
        status={f.status ? t.status[f.status] : ""}
      >
        {actions}
      </FormActionBar>
    </form>
  );
}

export default OrderForm;
