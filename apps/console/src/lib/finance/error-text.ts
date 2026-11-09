import { format, type Dictionary } from "@/lib/i18n";
import type { FieldErrors } from "./types";

/** Message of the error behind a `FieldErrors` key, or undefined when the field is valid. */
export function errorText(errors: FieldErrors, key: string, t: Dictionary): string | undefined {
  const error = errors[key];
  if (!error) return undefined;
  return format(t.pages.finance.fieldErrors[error.code], { max: error.max ?? "" });
}
