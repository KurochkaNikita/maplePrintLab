import type { Dictionary } from "@/lib/i18n";

export interface ProductViewStatusProps {
  published: boolean;
  noindex: boolean;
  isNew: boolean;
  labels: Dictionary["pages"]["products"]["view"];
}

const badge = "inline-flex min-h-6 items-center rounded-full border px-2.5 text-xs font-semibold";

/** Status as words, never colour alone: published/hidden, a separate noindex label and "new". */
export function ProductViewStatus({ published, noindex, isNew, labels }: ProductViewStatusProps) {
  return (
    <ul aria-label={labels.statusLabel} className="flex flex-wrap items-center gap-2">
      <li className={`${badge} ${published ? "border-green-700/40 bg-green-50 text-green-800" : "border-gray-400 bg-gray-100 text-gray-800"}`}>
        {published ? labels.published : labels.draft}
      </li>
      {noindex && <li className={`${badge} border-charcoal/40 bg-white font-mono text-charcoal`}>{labels.noindex}</li>}
      {isNew && <li className={`${badge} border-amber-deep/40 bg-amber/10 text-amber-deep`}>{labels.isNew}</li>}
    </ul>
  );
}

export default ProductViewStatus;
