"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormError from "@/components/FormError";
import { useT } from "@/components/LocaleProvider";
import Modal from "@/components/Modal";
import { deleteCollection } from "@/lib/collections/actions";
import { format } from "@/lib/i18n";

export interface DeleteCollectionProps {
  collectionId: string;
  title: string;
  /** Products that lose this collection (they stay on the site). */
  productCount: number;
}

/** "Delete" button plus the confirmation dialog; the products of the collection stay where they are. */
export function DeleteCollection({ collectionId, title, productCount }: DeleteCollectionProps) {
  const t = useT().pages.collections.delete;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<keyof typeof t.errors | null>(null);

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await deleteCollection(collectionId);
      if (result.ok) {
        router.push("/collections");
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
        {t.button}
      </Button>

      {open && (
        <Modal
          title={format(t.title, { name: title })}
          description={productCount > 0 ? format(t.bodyWithProducts, { count: productCount }) : t.bodyEmpty}
          onClose={handleClose}
          closable={!busy}
        >
          <FormError id="collection-delete-error" message={error ? t.errors[error] : null} />
          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={busy}>
              {t.cancel}
            </Button>
            <Button type="button" loading={busy} onClick={() => void handleConfirm()}>
              {busy ? t.deleting : t.confirm}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default DeleteCollection;
