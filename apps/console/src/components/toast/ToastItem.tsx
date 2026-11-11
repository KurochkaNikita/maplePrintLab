"use client";

import { useEffect } from "react";
import { useT } from "@/components/LocaleProvider";
import AlertCircleIcon from "@/icons/alert-circle.svg";
import CheckCircleIcon from "@/icons/check-circle.svg";
import CloseIcon from "@/icons/close.svg";

export type ToastKind = "success" | "error";

export interface ToastData {
  id: number;
  kind: ToastKind;
  message: string;
}

export interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: number) => void;
}

const SUCCESS_MS = 5000;
const ERROR_MS = 8000;

/** One notification: success announces politely, an error announces at once. Closes itself after a few seconds. */
export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const t = useT().shell.toast;
  const isError = toast.kind === "error";

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), isError ? ERROR_MS : SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [toast.id, isError, onDismiss]);

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`pointer-events-auto flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-sm font-medium text-white shadow-lg ${
        isError ? "bg-red-700" : "bg-green-700"
      }`}
    >
      {isError ? (
        <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
      ) : (
        <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
      )}
      <span className="flex-1 py-0.5">{toast.message}</span>
      <button
        type="button"
        aria-label={t.close}
        onClick={() => onDismiss(toast.id)}
        className="-my-1.5 -mr-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white hover:bg-white/20"
      >
        <CloseIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

export default ToastItem;
