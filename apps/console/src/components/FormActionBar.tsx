import type { ReactNode } from "react";
import Link from "next/link";
import Button from "@/components/Button";

export interface FormActionBarProps {
  submitLabel: string;
  saving: boolean;
  cancelHref: string;
  cancelLabel: string;
  /** Result of the last save ("Changes saved"); announced politely. */
  status?: string;
  /** Extra controls on the right, e.g. a delete button. */
  children?: ReactNode;
}

/** The sticky bar at the bottom of a form: save, back to the list, status, and optional extras. */
export function FormActionBar({ submitLabel, saving, cancelHref, cancelLabel, status = "", children }: FormActionBarProps) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-filament/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <Button type="submit" loading={saving}>
        {submitLabel}
      </Button>
      <Link
        href={cancelHref}
        className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-charcoal underline-offset-4 hover:underline"
      >
        {cancelLabel}
      </Link>
      <p role="status" className="text-sm font-medium text-charcoal">
        {status}
      </p>
      {children && <div className="ml-auto">{children}</div>}
    </div>
  );
}

export default FormActionBar;
