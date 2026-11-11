"use client";

import type { SubmitEvent } from "react";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";

export interface LookupRowFormProps {
  /** DOM id of the name input. */
  inputId: string;
  name: string;
  busy: boolean;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

/** The rename form of a pick-list entry. */
export function LookupRowForm({ inputId, name, busy, error, onChange, onSubmit, onCancel }: LookupRowFormProps) {
  const t = useT().pages.settings.common;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-wrap items-end gap-3">
      <InputField
        id={inputId}
        label={t.nameLabel}
        error={error}
        className="min-w-48 flex-1"
        autoComplete="off"
        autoFocus
        value={name}
        onChange={onChange}
      />
      <Button type="submit" size="sm" loading={busy}>
        {t.save}
      </Button>
      <Button type="button" size="sm" variant="secondary" onClick={onCancel} disabled={busy}>
        {t.cancel}
      </Button>
    </form>
  );
}

export default LookupRowForm;
