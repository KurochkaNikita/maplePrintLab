"use client";

import Button from "@/components/Button";
import { t } from "@/lib/i18n";

export interface PublishBarProps {
  unpublishedCount?: number;
  onPublish?: () => void;
}

export function PublishBar({
  unpublishedCount = 0,
  onPublish,
}: PublishBarProps) {
  const hasChanges = unpublishedCount > 0;

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border border-charcoal/20 bg-white px-3 py-2 shadow-sm sm:w-auto sm:justify-start sm:gap-3 sm:px-3.5">
      <div
        role="status"
        aria-label={t.shell.publish.statusAriaLabel}
        className="flex items-center gap-2 text-xs font-medium text-charcoal sm:text-sm"
      >
        {hasChanges ? (
          <>
            <span
              aria-hidden="true"
              className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-amber-deep ring-2 ring-amber/30"
            />
            <span>{t.shell.publish.unpublishedLabel}</span>
            <span className="inline-flex min-w-6 items-center justify-center rounded-md border border-amber-deep/40 bg-amber/10 px-2 py-0.5 font-mono text-xs font-semibold text-charcoal">
              {unpublishedCount}
            </span>
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-teal"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-ink">{t.shell.publish.noChanges}</span>
          </>
        )}
      </div>

      <Button
        type="button"
        variant={hasChanges ? "primary" : "secondary"}
        size="sm"
        disabled={!hasChanges || !onPublish}
        onClick={onPublish}
      >
        {t.shell.publish.button}
      </Button>
    </div>
  );
}

export default PublishBar;
