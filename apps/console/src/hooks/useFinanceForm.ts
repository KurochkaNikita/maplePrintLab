"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { fieldId, type FieldErrors, type FormErrorKind, type SaveResult } from "@/lib/finance/types";

export type FinanceFormStatus = "created" | "saved";

export interface UseFinanceFormOptions<V> {
  initialValues: V;
  /** Prefix of the DOM ids of the inputs (`fieldId(idPrefix, key)`), used to focus the first invalid one. */
  idPrefix: string;
  /** The same validation the server runs; returns the errors, or null when the values are fine. */
  validate: (values: V) => FieldErrors | null;
  save: (values: V) => Promise<SaveResult>;
  /** Where to go after a record was created, given its id; null for an edit form (it stays and refreshes). */
  getCreatedUrl: ((id: string) => string) | null;
  /** The page was reached right after creating the record. */
  justCreated?: boolean;
}

/**
 * State and behaviour shared by the order and expense forms: values, per-field errors, saving and moving
 * focus to the first invalid field. The form components only render.
 */
export function useFinanceForm<V>({ initialValues, idPrefix, validate, save, getCreatedUrl, justCreated = false }: UseFinanceFormOptions<V>) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<FormErrorKind | null>(null);
  const [status, setStatus] = useState<FinanceFormStatus | null>(justCreated ? "created" : null);
  const [saving, setSaving] = useState(false);
  const [focusRequest, setFocusRequest] = useState<{ key: string } | null>(null);

  useEffect(() => {
    if (focusRequest) document.getElementById(fieldId(idPrefix, focusRequest.key))?.focus();
  }, [focusRequest, idPrefix]);

  /** `touched` are the error keys of the edited fields: their messages go away as soon as the user edits them. */
  const change = (next: V, ...touched: string[]) => {
    setValues(next);
    setStatus(null);
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

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;

    const clientErrors = validate(values);
    if (clientErrors) {
      setFormError(null);
      showFieldErrors(clientErrors);
      return;
    }

    setSaving(true);
    setFormError(null);
    setStatus(null);
    let navigating = false;

    try {
      const result = await save(values);
      if (result.ok) {
        setErrors({});
        if (getCreatedUrl) {
          // Stay in the saving state until the next page replaces this one.
          navigating = true;
          router.push(getCreatedUrl(result.id));
        } else {
          setStatus("saved");
          router.refresh();
        }
      } else if ("errors" in result) {
        showFieldErrors(result.errors);
      } else {
        setFormError(result.formError);
      }
    } catch {
      setFormError("unknown");
    } finally {
      if (!navigating) setSaving(false);
    }
  };

  return { values, errors, errorTotal: Object.keys(errors).length, formError, status, saving, change, clearErrors, submit };
}
