"use client";

import { useEffect, useId, useRef, type ReactNode, type SyntheticEvent } from "react";

export interface ModalProps {
  title: string;
  description?: string;
  /** Called on Escape (unless `closable` is false). The parent decides whether to unmount the modal. */
  onClose: () => void;
  /** Set to false while something is in progress, so Escape does not abandon it. */
  closable?: boolean;
  children: ReactNode;
}

/** Modal dialog on the native `<dialog>`: focus trap, Escape and focus return come from the browser. */
export function Modal({ title, description, onClose, closable = true, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  /** Escape (or the browser's close request): the parent unmounts the modal, never the browser behind React's back. */
  function handleCancel(e: SyntheticEvent<HTMLDialogElement>) {
    e.preventDefault();
    if (closable) onClose();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      className="w-[calc(100%-2rem)] max-w-2xl rounded-2xl border border-line bg-white p-0 shadow-xl backdrop:bg-charcoal/60"
    >
      <div className="space-y-4 p-4 sm:p-6">
        <div>
          <h2 id={titleId} className="font-display text-lg font-semibold text-charcoal">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-ink">{description}</p>}
        </div>
        {children}
      </div>
    </dialog>
  );
}

export default Modal;
