"use client";

import { useEffect, useMemo, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/lib/categories/actions";
import {
  countErrorsByTab,
  fieldId,
  firstErrorKey,
  localeOfField,
  tabOfField,
  type CategoryFormValues,
  type FieldErrors,
  type ProductLocale,
  type TabId,
} from "@/lib/categories/types";

export type CategoryFormTarget = { mode: "create" } | { mode: "edit"; categoryId: string };

export type UseCategoryFormOptions = CategoryFormTarget & {
  initialValues: CategoryFormValues;
  /** The page was reached right after creating the category. */
  justCreated?: boolean;
};

/** Problems that belong to the whole form rather than to a field. */
export type CategoryFormErrorKind = "forbidden" | "notFound" | "unknown";
export type CategoryFormStatus = "created" | "saved";

/**
 * State and behaviour of the category form: the values, per-field errors from the server, the active tabs,
 * saving (create or update), and moving to the first invalid field. The component only renders.
 */
export function useCategoryForm(options: UseCategoryFormOptions) {
  const { initialValues, justCreated = false } = options;
  const router = useRouter();

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<CategoryFormErrorKind | null>(null);
  const [status, setStatus] = useState<CategoryFormStatus | null>(justCreated ? "created" : null);
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
  const change = (next: CategoryFormValues, ...touched: string[]) => {
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
          ? await createCategory(values)
          : await updateCategory(options.categoryId, values);

      if (result.ok) {
        setErrors({});
        if (options.mode === "create" || result.id !== options.categoryId) {
          // Stay in the saving state until the edit page for the (new) slug replaces this one.
          navigating = true;
          router.push(`/categories/${result.id}${options.mode === "create" ? "?created=1" : ""}`);
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
