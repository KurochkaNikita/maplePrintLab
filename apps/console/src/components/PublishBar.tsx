"use client";

import { useState, useTransition } from "react";
import Button from "@/components/Button";
import AlertCircleIcon from "@/icons/alert-circle.svg";
import { useT } from "@/components/LocaleProvider";
import { publishSite, type PublishResult } from "@/lib/publish/actions";

/** Button that rebuilds the public site; the outcome is announced in a status line next to it. */
export function PublishBar() {
  const t = useT();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<PublishResult | null>(null);

  const handlePublish = () => {
    setResult(null);
    startTransition(async () => setResult(await publishSite()));
  };

  const message = !result ? "" : result.ok ? t.shell.publish.started : t.shell.publish[result.error];

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
      <p
        role="status"
        aria-label={t.shell.publish.statusAriaLabel}
        className={`inline-flex items-center gap-1.5 text-xs text-charcoal sm:text-sm ${result && !result.ok ? "font-medium" : ""}`}
      >
        {result && !result.ok && <AlertCircleIcon className="h-4 w-4 shrink-0 text-amber-deep" />}
        {message}
      </p>

      <Button type="button" variant="primary" size="sm" loading={pending} onClick={handlePublish} className="!min-h-9 px-3.5 py-1.5 text-xs">
        {t.shell.publish.button}
      </Button>
    </div>
  );
}

export default PublishBar;
