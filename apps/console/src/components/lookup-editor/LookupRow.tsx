"use client";

import type { SubmitEvent } from "react";
import type { FinanceOption } from "@maple-print-lab/db";
import LookupRowForm from "./LookupRowForm";
import LookupRowView from "./LookupRowView";

export interface LookupRowProps {
  item: FinanceOption;
  /** DOM id prefix of this list, so row inputs have unique ids. */
  idPrefix: string;
  editing: boolean;
  busy: boolean;
  editName: string;
  /** Error text for this row (rename or delete), if any. */
  error?: string;
  onEditName: (value: string) => void;
  onStartEdit: (id: number) => void;
  onCancelEdit: () => void;
  onRename: (e: SubmitEvent<HTMLFormElement>, id: number) => void;
  onRemove: (id: number) => void;
}

/** One entry of a pick-list: the rename form while editing, otherwise the name with its buttons. */
export function LookupRow({ item, idPrefix, editing, busy, editName, error, onEditName, onStartEdit, onCancelEdit, onRename, onRemove }: LookupRowProps) {
  if (editing) {
    return (
      <li className="py-3">
        <LookupRowForm
          inputId={`${idPrefix}-edit-${item.id}`}
          name={editName}
          busy={busy}
          error={error}
          onChange={onEditName}
          onSubmit={(e) => onRename(e, item.id)}
          onCancel={onCancelEdit}
        />
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-2">
      <LookupRowView name={item.name} usage={item.usage} busy={busy} error={error} onEdit={() => onStartEdit(item.id)} onRemove={() => onRemove(item.id)} />
    </li>
  );
}

export default LookupRow;
