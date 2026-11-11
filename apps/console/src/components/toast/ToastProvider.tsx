"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { ToastContext } from "@/hooks/useToast";
import ToastItem, { type ToastData, type ToastKind } from "./ToastItem";

/** Lives in the admin shell, so a notification survives navigation (e.g. "deleted" right after the redirect). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((toast) => toast.id !== id)), []);
  const notify = useCallback((kind: ToastKind, message: string) => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts((all) => [...all.slice(-2), { id, kind, message }]);
  }, []);
  const api = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-6 sm:top-6 sm:w-96">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
