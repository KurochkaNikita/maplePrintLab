import { format, type Dictionary } from "@/lib/i18n";
import type {
  FieldErrors,
  ProductFormValues,
  ProductLocale,
  ProductTextValues,
} from "@/lib/products/types";

/**
 * Props every tab receives. `onChange` takes the next values plus the error keys
 * for the fields that were touched, so their messages disappear as soon as the user edits them.
 */
export interface TabProps {
  values: ProductFormValues;
  errors: FieldErrors;
  onChange: (next: ProductFormValues, ...touched: string[]) => void;
}

/** Tabs with one panel per language share the selected language. */
export interface LocaleTabProps extends TabProps {
  locale: ProductLocale;
  onLocaleChange: (locale: ProductLocale) => void;
}

export function withText(
  values: ProductFormValues,
  locale: ProductLocale,
  patch: Partial<ProductTextValues>,
): ProductFormValues {
  return {
    ...values,
    translations: { ...values.translations, [locale]: { ...values.translations[locale], ...patch } },
  };
}

export function withDimension(
  values: ProductFormValues,
  unit: "cm" | "in",
  index: number,
  value: string,
): ProductFormValues {
  const next = [...values.dimensions[unit]] as [string, string, string];
  next[index] = value;
  return { ...values, dimensions: { ...values.dimensions, [unit]: next } };
}

export function errorText(errors: FieldErrors, key: string, t: Dictionary): string | undefined {
  const error = errors[key];
  if (!error) return undefined;
  return format(t.pages.products.form.errors[error.code], { max: error.max ?? "" });
}
