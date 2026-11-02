import { format, type Dictionary } from "@/lib/i18n";
import type {
  FieldErrors,
  ProductFormValues,
  ProductLocale,
  ProductTextValues,
} from "@/lib/products/types";

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
