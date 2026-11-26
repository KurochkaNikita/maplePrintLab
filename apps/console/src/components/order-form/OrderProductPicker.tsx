"use client";

import type { ProductSaleOption } from "@maple-print-lab/db";
import Combobox from "@/components/Combobox";
import Field from "@/components/Field";
import { useT } from "@/components/LocaleProvider";
import { format } from "@/lib/i18n";

export interface OrderProductPickerProps {
  id: string;
  products: ProductSaleOption[];
  /** Catalogue product id, or "" for a custom item. */
  value: string;
  error?: string;
  onPick: (productId: string) => void;
  /** A custom item, with what was typed in the search ("" when nothing). */
  onPickCustom: (typed: string) => void;
  className?: string;
}

/** Search of a catalogue product by name; the last row makes a custom item instead. */
export function OrderProductPicker({ id, products, value, error, onPick, onPickCustom, className }: OrderProductPickerProps) {
  const t = useT().pages.orders.form.items;

  return (
    <Field id={id} label={t.productLabel} tip={t.productHint} error={error} className={className}>
      {(control) => (
        <Combobox
          {...control}
          options={products.map((p) => ({ value: String(p.id), label: p.title }))}
          value={value}
          onSelect={onPick}
          onExtra={onPickCustom}
          extraLabel={(typed) => (typed ? format(t.productCustomTyped, { text: typed }) : t.productCustom)}
          placeholder={t.productSearch}
          noMatchText={t.productNoMatch}
          countText={(count) => format(t.productCount, { count })}
        />
      )}
    </Field>
  );
}

export default OrderProductPicker;
