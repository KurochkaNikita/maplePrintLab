"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormError from "@/components/FormError";
import { useT } from "@/components/LocaleProvider";
import Modal from "@/components/Modal";
import { deleteCategory } from "@/lib/categories/actions";
import { format } from "@/lib/i18n";

export interface DeleteCategoryProps {
  categoryId: string;
  title: string;
  /** Products that will move to the fallback category. */
  productCount: number;
}

/** "Delete" button plus the confirmation dialog; products of the category move to the fallback category. */
export function DeleteCategory({ categoryId, title, productCount }: DeleteCategoryProps) {
  const t = useT().pages.categories.delete;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<keyof typeof t.errors | null>(null);

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await deleteCategory(categoryId);
      if (result.ok) {
        router.push("/categories");
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
          <FormError id="category-delete-error" message={error ? t.errors[error] : null} />
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

export default DeleteCategory;
