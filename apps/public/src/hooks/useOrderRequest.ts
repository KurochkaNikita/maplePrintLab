"use client";

import { useRef, useState, type SubmitEvent } from "react";
import { validateOrderRequest, type OrderRequestErrors } from "@maple-print-lab/db/src/order-request-validation";
import { clearCart, type CartLine } from "@/lib/cart/store";
import { postOrderRequest } from "@/lib/order/api";
import { orderApiUrl, turnstileSiteKey } from "@/lib/order/config";
import type { Locale } from "@/lib/i18n";

export type OrderValues = { firstName: string; lastName: string; email: string; message: string };
export type OrderField = keyof OrderValues;
export type OrderStatus = "editing" | "sending" | "sent";

const EMPTY: OrderValues = { firstName: "", lastName: "", email: "", message: "" };
const FIELD_ORDER: OrderField[] = ["firstName", "lastName", "email", "message"];

export const orderFieldId = (field: OrderField) => `order-${field}`;

/** State of the request form: values, errors, the anti-spam fields and the call to the API. `lines` are the pieces being requested. */
export function useOrderRequest({ lines, lang }: { lines: CartLine[]; lang: Locale }) {
  const [values, setValues] = useState(EMPTY);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<OrderRequestErrors>({});
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const [status, setStatus] = useState<OrderStatus>("editing");
  const [token, setToken] = useState("");
  // A Turnstile token works once: a new key after each attempt mounts a fresh widget.
  const [attempt, setAttempt] = useState(0);
  // The moment the visitor opened the page; a form sent within seconds of that was not filled in by a person.
  const startedAt = useRef(Date.now());

  const setField = (field: OrderField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors(({ [field]: _removed, ...rest }) => rest);
  };

  /** The list changed (a piece was removed), so earlier complaints about it no longer apply. */
  const clearItemsFeedback = () => {
    setUnavailable([]);
    if (errors.items) setErrors(({ items: _removed, ...rest }) => rest);
  };

  const focusFirstInvalid = (found: OrderRequestErrors) => {
    const first = FIELD_ORDER.find((field) => found[field]);
    if (first) document.getElementById(orderFieldId(first))?.focus();
  };

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const checked = validateOrderRequest({ ...values, items: lines, locale: lang });
    if ("errors" in checked) {
      setErrors(checked.errors);
      focusFirstInvalid(checked.errors);
      return;
    }
    if (turnstileSiteKey && !token) {
      setErrors({ form: "captcha" });
      return;
    }

    setErrors({});
    setUnavailable([]);
    setStatus("sending");
    const result = await postOrderRequest(orderApiUrl, {
      ...values,
      items: lines,
      locale: lang,
      website,
      startedAt: startedAt.current,
      turnstileToken: token,
    });
    if (result.ok) {
      clearCart();
      setStatus("sent");
      return;
    }
    setErrors(result.errors);
    setUnavailable(result.unknownSlugs);
    setStatus("editing");
    setToken("");
    setAttempt((n) => n + 1);
    focusFirstInvalid(result.errors);
  };

  const fieldErrorCount = FIELD_ORDER.filter((field) => errors[field]).length;

  return { values, setField, website, setWebsite, errors, unavailable, clearItemsFeedback, fieldErrorCount, status, submit, setToken, attempt };
}

export type OrderRequestState = ReturnType<typeof useOrderRequest>;
