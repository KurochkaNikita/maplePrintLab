"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/LocaleProvider";
import { useToast } from "@/components/toast/ToastProvider";
import { fieldId, type FieldErrors, type FormErrorKind, type SaveResult } from "@/lib/finance/types";

export interface UseFinanceFormOptions<V> {
  initialValues: V;
  /** Prefix of the DOM ids of the inputs (`fieldId(idPrefix, key)`), used to focus the first invalid one. */
  idPrefix: string;
  /** The same validation the server runs; returns the errors, or null when the values are fine. */
  validate: (values: V) => FieldErrors | null;
  save: (values: V) => Promise<SaveResult>;
  /** A create form clears itself after saving so the next record can be typed in; an edit form keeps its values. */
  resetAfterSave: boolean;
  /** Notification texts of a successful save. */
  messages: { created: string; saved: string };
}

/**
 * State and behaviour shared by the order and expense forms: values, per-field errors, saving, notifications
 * and moving focus to the first invalid field. The form components only render.
 */
export function useFinanceForm<V>({ initialValues, idPrefix, validate, save, resetAfterSave, messages }: UseFinanceFormOptions<V>) {
  const router = useRouter();
  const { notify } = useToast();
  const formErrors = useT().pages.finance.formErrors;
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [focusRequest, setFocusRequest] = useState<{ key: string } | null>(null);

  useEffect(() => {
    if (focusRequest) document.getElementById(fieldId(idPrefix, focusRequest.key))?.focus();
  }, [focusRequest, idPrefix]);

  /** `touched` are the error keys of the edited fields: their messages go away as soon as the user edits them. */
  const change = (next: V, ...touched: string[]) => {
    setValues(next);
    if (touched.some((key) => key in errors)) {
      setErrors(Object.fromEntries(Object.entries(errors).filter(([key]) => !touched.includes(key))));
    }
  };

  /** Replaces all errors (e.g. after removing a row, when the row-numbered keys went stale). */
  const clearErrors = () => setErrors({});

  const showFieldErrors = (fieldErrors: FieldErrors) => {
    setErrors(fieldErrors);
    const first = Object.keys(fieldErrors)[0];
    if (first) setFocusRequest({ key: first });
  };

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;

    const clientErrors = validate(values);
    if (clientErrors) {
      showFieldErrors(clientErrors);
      return;
    }

    setSaving(true);

    try {
      const result = await save(values);
      if (result.ok) {
        setErrors({});
        if (resetAfterSave) setValues(initialValues);
        notify("success", resetAfterSave ? messages.created : messages.saved);
        router.refresh();
      } else if ("errors" in result) {
        showFieldErrors(result.errors);
      } else {
        notify("error", formErrors[result.formError satisfies FormErrorKind]);
      }
    } catch {
      notify("error", formErrors.unknown);
    } finally {
      setSaving(false);
    }
  };

  return { values, errors, errorTotal: Object.keys(errors).length, saving, change, clearErrors, submit };
}
