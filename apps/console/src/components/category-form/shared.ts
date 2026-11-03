import { format, type Dictionary } from "@/lib/i18n";
import type {
  CategoryFormValues,
  CategoryTextValues,
  FieldErrors,
  ProductLocale,
} from "@/lib/categories/types";

export function withText(
  values: CategoryFormValues,
  locale: ProductLocale,
  patch: Partial<CategoryTextValues>,
): CategoryFormValues {
  return {
    ...values,
    translations: { ...values.translations, [locale]: { ...values.translations[locale], ...patch } },
  };
}

export function errorText(errors: FieldErrors, key: string, t: Dictionary): string | undefined {
  const error = errors[key];
  if (!error) return undefined;
  return format(t.pages.categories.form.errors[error.code], { max: error.max ?? "" });
}
