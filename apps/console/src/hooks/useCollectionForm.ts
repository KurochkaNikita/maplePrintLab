"use client";

import { useEffect, useMemo, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { createCollection, updateCollection } from "@/lib/collections/actions";
import {
  countErrorsByTab,
  fieldId,
  firstErrorKey,
  localeOfField,
  tabOfField,
  type CollectionFormValues,
  type FieldErrors,
  type ProductLocale,
  type TabId,
} from "@/lib/collections/types";

export type CollectionFormTarget = { mode: "create" } | { mode: "edit"; collectionId: string };

export type UseCollectionFormOptions = CollectionFormTarget & {
  initialValues: CollectionFormValues;
  /** The page was reached right after creating the collection. */
  justCreated?: boolean;
};

/** Problems that belong to the whole form rather than to a field. */
export type CollectionFormErrorKind = "forbidden" | "notFound" | "unknown";
export type CollectionFormStatus = "created" | "saved";

/**
 * State and behaviour of the collection form: the values, per-field errors from the server, the active tabs,
 * saving (create or update), and moving to the first invalid field. The component only renders.
 */
export function useCollectionForm(options: UseCollectionFormOptions) {
  const { initialValues, justCreated = false } = options;
  const router = useRouter();

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<CollectionFormErrorKind | null>(null);
  const [status, setStatus] = useState<CollectionFormStatus | null>(justCreated ? "created" : null);
  const [tab, setTab] = useState<TabId>("general");
  const [locale, setLocale] = useState<ProductLocale>("en");
  const [saving, setSaving] = useState(false);
  const [focusRequest, setFocusRequest] = useState<{ key: string } | null>(null);

  // The panel holding the invalid field is only shown after the tab state commits.
  useEffect(() => {
    if (focusRequest) document.getElementById(fieldId(focusRequest.key))?.focus();
  }, [focusRequest]);

  const errorCounts = useMemo(() => countErrorsByTab(errors), [errors]);
  const errorTotal = Object.keys(errors).length;

  /** `touched` are the error keys of the edited fields: their messages go away as soon as the user edits them. */
  const change = (next: CollectionFormValues, ...touched: string[]) => {
    setValues(next);
    setStatus(null);
    if (touched.some((key) => key in errors)) {
      setErrors(Object.fromEntries(Object.entries(errors).filter(([key]) => !touched.includes(key))));
    }
  };

  const showFieldErrors = (fieldErrors: FieldErrors) => {
    setErrors(fieldErrors);
    const first = firstErrorKey(fieldErrors);
    if (!first) return;
    setTab(tabOfField(first));
    setLocale(localeOfField(first) ?? locale);
    setFocusRequest({ key: first });
  };

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setFormError(null);
    setStatus(null);
    let navigating = false;

    try {
      const result =
        options.mode === "create"
          ? await createCollection(values)
          : await updateCollection(options.collectionId, values);

      if (result.ok) {
        setErrors({});
        if (options.mode === "create" || result.id !== options.collectionId) {
          // Stay in the saving state until the edit page for the (new) slug replaces this one.
          navigating = true;
          router.push(`/collections/${result.id}${options.mode === "create" ? "?created=1" : ""}`);
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

  return {
    values,
    errors,
    errorCounts,
    errorTotal,
    formError,
    status,
    saving,
    tab,
    setTab,
    locale,
    setLocale,
    change,
    submit,
  };
}
