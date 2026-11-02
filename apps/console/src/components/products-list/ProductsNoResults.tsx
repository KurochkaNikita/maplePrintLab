import { format, type Dictionary } from "@/lib/i18n";

export interface ProductsNoResultsProps {
  labels: Dictionary["pages"]["products"]["list"]["search"];
  query: string;
}

/** Shown inside the list card when a search matches nothing (the search box stays above it). */
export function ProductsNoResults({ labels, query }: ProductsNoResultsProps) {
  return (
    <div role="status" className="p-8 text-center sm:p-12">
      <h2 className="font-display text-lg font-semibold text-charcoal sm:text-xl">{labels.noResultsTitle}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink sm:text-base">
        {format(labels.noResultsBody, { q: query })}
      </p>
    </div>
  );
}

export default ProductsNoResults;
