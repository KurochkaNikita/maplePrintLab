"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { FinanceOption, FinanceOptionKind } from "@maple-print-lab/db";
import { addOption, removeOption, renameOption } from "@/lib/finance/actions";
import type { OptionResult } from "@/lib/finance/types";

export type LookupErrorCode = Extract<OptionResult, { ok: false }>["error"];

/** Where an error belongs: the "add" input, or the row with this id. */
export type LookupErrorScope = "add" | number;

export interface UseLookupEditorOptions {
  kind: FinanceOptionKind;
  items: FinanceOption[];
}

/** State of one pick-list editor: the new name, the row being renamed, and the calls to the server. */
export function useLookupEditor({ kind, items }: UseLookupEditorOptions) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ scope: LookupErrorScope; code: LookupErrorCode; max?: number } | null>(null);

  /** Runs a server call; on success refreshes the list, on failure remembers where to show the error. */
  const run = async (scope: LookupErrorScope, call: () => Promise<OptionResult>): Promise<boolean> => {
    setBusy(true);
    setError(null);
    try {
      const result = await call();
      if (result.ok) {
        router.refresh();
        return true;
      }
      setError({ scope, code: result.error, max: result.max });
    } catch {
      setError({ scope, code: "unknown" });
    } finally {
      setBusy(false);
    }
    return false;
  };

  const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    if (await run("add", () => addOption(kind, newName))) setNewName("");
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

  const handleRename = async (e: FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
    if (busy) return;
    if (await run(id, () => renameOption(kind, id, editName))) setEditingId(null);
  };

  const handleRemove = async (id: number) => {
    if (busy) return;
    await run(id, () => removeOption(kind, id));
  };

  const changeNewName = (value: string) => {
    setNewName(value);
    if (error?.scope === "add") setError(null);
  };

  return { newName, changeNewName, editingId, editName, setEditName, busy, error, handleAdd, startEdit, cancelEdit, handleRename, handleRemove };
}
