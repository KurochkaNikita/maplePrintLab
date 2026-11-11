"use client";

import { useId } from "react";
import type { FinanceOption, FinanceOptionKind } from "@maple-print-lab/db";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import { useLookupEditor } from "@/hooks/useLookupEditor";
import { format } from "@/lib/i18n";
import LookupRow from "./LookupRow";

export interface LookupEditorProps {
  kind: FinanceOptionKind;
  items: FinanceOption[];
  title: string;
  hint: string;
  addLabel: string;
  addPlaceholder: string;
}

/** A pick-list the admin can grow, rename and shrink (entries still in use cannot be deleted). */
export function LookupEditor({ kind, items, title, hint, addLabel, addPlaceholder }: LookupEditorProps) {
  const t = useT().pages.settings.common;
  const idPrefix = useId();
  const headingId = `${idPrefix}-heading`;
  const editor = useLookupEditor({ kind, items });
  const errorText = (scope: "add" | number) =>
    editor.error?.scope === scope ? format(t.errors[editor.error.code], { max: editor.error.max ?? "" }) : undefined;

  return (
    <section aria-labelledby={headingId} className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-6">
      <h2 id={headingId} className="font-display text-xl font-semibold text-charcoal">
        {title}
      </h2>
      <p className="mt-1 text-sm text-ink">{hint}</p>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink">{t.empty}</p>
      ) : (
        <ul aria-label={format(t.listLabel, { title })} className="mt-4 divide-y divide-line">
          {items.map((item) => (
            <LookupRow
              key={item.id}
              item={item}
              idPrefix={idPrefix}
              editing={editor.editingId === item.id}
              busy={editor.busy}
              editName={editor.editName}
              error={errorText(item.id)}
              onEditName={editor.setEditName}
              onStartEdit={editor.startEdit}
              onCancelEdit={editor.cancelEdit}
              onRename={editor.handleRename}
              onRemove={editor.handleRemove}
            />
          ))}
        </ul>
      )}

      <form onSubmit={editor.handleAdd} noValidate className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
        <InputField
          id={`${idPrefix}-new`}
          label={addLabel}
          error={errorText("add")}
          placeholder={addPlaceholder}
          className="min-w-48 flex-1"
          autoComplete="off"
          value={editor.newName}
          onChange={editor.changeNewName}
        />
        <Button type="submit" loading={editor.busy && editor.editingId === null}>
          {t.add}
        </Button>
      </form>
    </section>
  );
}

export default LookupEditor;
