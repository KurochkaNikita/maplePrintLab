"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import type { FinanceOption, FinanceOptionKind } from "@maple-print-lab/db";
import { useT } from "@/components/LocaleProvider";
import { useToast } from "@/hooks/useToast";
import { addOption, removeOption, renameOption } from "@/lib/finance/actions";
import type { OptionResult } from "@/lib/finance/types";

export type LookupErrorCode = Extract<OptionResult, { ok: false }>["error"];

/** Where an error belongs: the "add" input, or the row with this id. */
export type LookupErrorScope = "add" | number;

export interface UseLookupEditorOptions {
  kind: FinanceOptionKind;
  items: FinanceOption[];
}

/** Mistakes in the typed name stay next to the input; everything else is a notification. */
const FIELD_ERRORS: readonly LookupErrorCode[] = ["required", "tooLong", "taken"];

/** State of one pick-list editor: the new name, the row being renamed, and the calls to the server. */
export function useLookupEditor({ kind, items }: UseLookupEditorOptions) {
  const router = useRouter();
  const { notify } = useToast();
  const t = useT().pages.settings.common;
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ scope: LookupErrorScope; code: LookupErrorCode; max?: number } | null>(null);

  /** Runs a server call; on success refreshes the list, on failure remembers where to show the error. */
  const run = async (scope: LookupErrorScope, call: () => Promise<OptionResult>, successMessage: string): Promise<boolean> => {
    setBusy(true);
    setError(null);
    try {
      const result = await call();
      if (result.ok) {
        notify("success", successMessage);
        router.refresh();
        return true;
      }
      if (FIELD_ERRORS.includes(result.error)) setError({ scope, code: result.error, max: result.max });
      else notify("error", t.errors[result.error]);
    } catch {
      notify("error", t.errors.unknown);
    } finally {
      setBusy(false);
    }
    return false;
  };

  const handleAdd = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    if (await run("add", () => addOption(kind, newName), t.toast.added)) setNewName("");
  };

  const startEdit = (id: number) => {
    setError(null);
    setEditingId(id);
    setEditName(items.find((item) => item.id === id)?.name ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  const handleRename = async (e: SubmitEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
    if (busy) return;
    if (await run(id, () => renameOption(kind, id, editName), t.toast.renamed)) setEditingId(null);
  };

  const handleRemove = async (id: number) => {
    if (busy) return;
    await run(id, () => removeOption(kind, id), t.toast.removed);
  };

  const changeNewName = (value: string) => {
    setNewName(value);
    if (error?.scope === "add") setError(null);
  };

  return { newName, changeNewName, editingId, editName, setEditName, busy, error, handleAdd, startEdit, cancelEdit, handleRename, handleRemove };
}
