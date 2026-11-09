"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormError from "@/components/FormError";
import Modal from "@/components/Modal";

export interface ConfirmDeleteLabels {
  button: string;
  title: string;
  body: string;
  cancel: string;
  confirm: string;
  deleting: string;
}

export interface ConfirmDeleteProps {
  labels: ConfirmDeleteLabels;
  /** Message per failure kind of the action. */
  errors: Record<"forbidden" | "notFound" | "unknown", string>;
  /** A server action bound to the record, e.g. `deleteOrder.bind(null, id)`. */
  action: () => Promise<{ ok: true } | { ok: false; formError: "forbidden" | "notFound" | "unknown" }>;
  /** Where to go after a successful delete. */
  redirectTo: string;
}

/** "Delete" button plus a confirmation dialog. */
export function ConfirmDelete({ labels, errors, action, redirectTo }: ConfirmDeleteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<keyof typeof errors | null>(null);

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (result.ok) {
        router.push(redirectTo);
        return; // stay busy until the list replaces this page
      }
      setError(result.formError);
    } catch {
      setError("unknown");
    }
    setBusy(false);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        {labels.button}
      </Button>

      {open && (
        <Modal title={labels.title} description={labels.body} onClose={handleClose} closable={!busy}>
          <FormError id="confirm-delete-error" message={error ? errors[error] : null} />
          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={busy}>
              {labels.cancel}
            </Button>
            <Button type="button" loading={busy} onClick={() => void handleConfirm()}>
              {busy ? labels.deleting : labels.confirm}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ConfirmDelete;
