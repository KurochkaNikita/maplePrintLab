import { format, type Dictionary } from "@/lib/i18n";
import type { CollectionFormValues, CollectionTextValues, FieldErrors, ProductLocale } from "@/lib/collections/types";

export function withText(
  values: CollectionFormValues,
  locale: ProductLocale,
  patch: Partial<CollectionTextValues>,
): CollectionFormValues {
  return {
    ...values,
    translations: { ...values.translations, [locale]: { ...values.translations[locale], ...patch } },
  };
}

export function errorText(errors: FieldErrors, key: string, t: Dictionary): string | undefined {
  const error = errors[key];
  if (!error) return undefined;
  return format(t.pages.collections.form.errors[error.code], { max: error.max ?? "" });
}
