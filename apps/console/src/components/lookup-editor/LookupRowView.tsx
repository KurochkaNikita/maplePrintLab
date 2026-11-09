"use client";

import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import { useT } from "@/components/LocaleProvider";
import TrashIcon from "@/icons/trash.svg";
import { format } from "@/lib/i18n";

export interface LookupRowViewProps {
  name: string;
  /** How many records use this entry. */
  usage: number;
  busy: boolean;
  error?: string;
  onEdit: () => void;
  onRemove: () => void;
}

/** A pick-list entry at rest: name, usage and the rename and delete buttons. */
export function LookupRowView({ name, usage, busy, error, onEdit, onRemove }: LookupRowViewProps) {
  const t = useT().pages.lists.common;

  return (
    <>
      <div>
        <p className="font-medium text-charcoal">{name}</p>
        <p className="text-sm text-ink">{usage > 0 ? format(t.usage, { count: usage }) : t.unused}</p>
        {error && (
          <p role="alert" className="mt-1 text-sm font-medium text-amber-deep">
            {error}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={onEdit} aria-label={format(t.editAria, { name })}>
          {t.edit}
        </Button>
        <IconButton icon={TrashIcon} tone="danger" label={format(t.removeAria, { name })} disabled={busy} onClick={onRemove} />
      </div>
    </>
  );
}

export default LookupRowView;
