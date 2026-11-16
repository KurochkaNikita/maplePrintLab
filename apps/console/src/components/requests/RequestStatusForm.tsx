"use client";

import Button from "@/components/Button";
import { useT } from "@/components/LocaleProvider";
import SelectField from "@/components/SelectField";
import { useRequestStatusForm } from "@/hooks/useRequestStatusForm";
import { isRequestStatus, ORDER_REQUEST_STATUSES, type OrderRequestStatus } from "@/lib/order-requests/params";

export interface RequestStatusFormProps {
  requestId: string;
  status: OrderRequestStatus;
}

/** Select + save button that changes only the status of one request. */
export function RequestStatusForm({ requestId, status }: RequestStatusFormProps) {
  const t = useT().pages.requests;
  const { value, setValue, saving, handleSubmit, changed } = useRequestStatusForm({ requestId, status });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <SelectField
        id="request-status"
        label={t.detail.statusForm.label}
        className="sm:w-64"
        value={value}
        onChange={(v) => isRequestStatus(v) && setValue(v)}
      >
        {ORDER_REQUEST_STATUSES.map((s) => (
          <option key={s} value={s}>
            {t.status[s]}
          </option>
        ))}
      </SelectField>
      <Button type="submit" variant="secondary" loading={saving} disabled={saving || !changed}>
        {saving ? t.detail.statusForm.saving : t.detail.statusForm.save}
      </Button>
    </form>
  );
}

export default RequestStatusForm;
