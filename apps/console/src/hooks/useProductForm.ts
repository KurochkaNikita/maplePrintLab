"use client";

import { useEffect, useMemo, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { createProduct, setProductPublished, updateProduct } from "@/lib/products/actions";
import {
  countErrorsByTab,
  fieldId,
  firstErrorKey,
  localeOfField,
  tabOfField,
  type FieldErrors,
  type ProductFormValues,
  type ProductLocale,
  type TabId,
} from "@/lib/products/types";

export type ProductFormTarget = { mode: "create" } | { mode: "edit"; productId: number };

export type UseProductFormOptions = ProductFormTarget & {
  initialValues: ProductFormValues;
  /** The page was reached right after creating the product. */
  justCreated?: boolean;
};

/** Problems that belong to the whole form rather than to a field. */
export type ProductFormErrorKind = "forbidden" | "notFound" | "unknown";
export type ProductFormStatus = "created" | "saved";

/**
 * State and behaviour of the product form: the values, per-field errors from the server, the active tabs,
 * saving (create or update), and moving to the first invalid field. The component only renders.
 */
export function useProductForm(options: UseProductFormOptions) {
  const { initialValues, justCreated = false } = options;
  const router = useRouter();

  const [values, setValues] = useState(initialValues);
  // Values as last saved: lets us tell a visibility-only edit from a full one.
  const [savedValues, setSavedValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<ProductFormErrorKind | null>(null);
  const [status, setStatus] = useState<ProductFormStatus | null>(justCreated ? "created" : null);
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
  const change = (next: ProductFormValues, ...touched: string[]) => {
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
      // Only "show on site" changed: skip validating (and rewriting) the other fields.
      const onlyPublishedChanged =
        options.mode === "edit" &&
        values.published !== savedValues.published &&
        JSON.stringify({ ...values, published: savedValues.published }) === JSON.stringify(savedValues);

      const result =
        options.mode === "create"
          ? await createProduct(values)
          : onlyPublishedChanged
            ? await setProductPublished(options.productId, values.published)
            : await updateProduct(options.productId, values);

      if (result.ok) {
        setErrors({});
        setSavedValues(values);
        if (options.mode === "create") {
          // Stay in the saving state until the edit page replaces this one.
          navigating = true;
          router.push(`/products/${result.id}?created=1`);
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
