"use client";

import { createContext, useContext } from "react";
import type { ToastKind } from "@/components/toast/ToastItem";

export interface ToastApi {
  /** Shows a notification at the top of the screen: green for success, red for an error. */
  notify: (kind: ToastKind, message: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

/** Shows notifications from anywhere inside the admin shell. */
export function useToast(): ToastApi {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside <ToastProvider>");
  return value;
}
