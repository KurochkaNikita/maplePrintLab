"use client";

import Button from "@/components/Button";
import { useT } from "@/components/LocaleProvider";
import CheckCircleIcon from "@/icons/check-circle.svg";

export interface PublishBarProps {
  unpublishedCount?: number;
  onPublish?: () => void;
}

export function PublishBar({
  unpublishedCount = 0,
  onPublish,
}: PublishBarProps) {
  const t = useT();
  const hasChanges = unpublishedCount > 0;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-2.5">
      <div
        role="status"
        aria-label={t.shell.publish.statusAriaLabel}
        className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
          hasChanges
            ? "border-amber-deep/30 bg-amber/10 text-charcoal"
            : "border-line bg-white text-ink"
        }`}
      >
        {hasChanges ? (
          <>
            <span
              aria-hidden="true"
              className="inline-flex h-2 w-2 shrink-0 rounded-full bg-amber-deep ring-2 ring-amber/30"
            />
            <span>{t.shell.publish.unpublishedLabel}</span>
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-amber-deep px-1.5 py-0.5 font-mono text-[11px] font-semibold leading-none text-filament">
              {unpublishedCount}
            </span>
          </>
        ) : (
          <>
            <CheckCircleIcon className="h-4 w-4 shrink-0 text-teal" />
            <span>{t.shell.publish.noChanges}</span>
          </>
        )}
      </div>

      <Button
        type="button"
        variant={hasChanges ? "primary" : "secondary"}
        size="sm"
        disabled={!hasChanges || !onPublish}
        onClick={onPublish}
        className="!min-h-9 px-3.5 py-1.5 text-xs disabled:border disabled:border-line disabled:bg-white/60 disabled:text-ink/50"
      >
        {t.shell.publish.button}
      </Button>
    </div>
  );
}

export default PublishBar;
