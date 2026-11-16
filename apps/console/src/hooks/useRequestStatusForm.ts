"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/LocaleProvider";
import { useToast } from "@/hooks/useToast";
import { changeRequestStatus } from "@/lib/order-requests/actions";
import type { OrderRequestStatus } from "@/lib/order-requests/params";

export interface UseRequestStatusFormOptions {
  requestId: string;
  /** Status saved in the database; the form starts from it. */
  status: OrderRequestStatus;
}

/** State and submit of the "change status" form of one request: saves, tells the result in a toast and refreshes the page. */
export function useRequestStatusForm({ requestId, status }: UseRequestStatusFormOptions) {
  const t = useT().pages.requests.detail;
  const router = useRouter();
  const { notify } = useToast();
  const [value, setValue] = useState<OrderRequestStatus>(status);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await changeRequestStatus(requestId, value);
      if (result.ok) {
        notify("success", t.statusForm.saved);
        router.refresh();
      } else {
        notify("error", t.errors[result.formError]);
      }
    } catch {
      notify("error", t.errors.unknown);
    } finally {
      setSaving(false);
    }
  };

  return { value, setValue, saving, handleSubmit, changed: value !== status };
}
