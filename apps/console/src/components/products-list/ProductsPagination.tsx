import { format, type Dictionary } from "@/lib/i18n";
import ButtonLink from "@/components/ButtonLink";

export interface ProductsPaginationProps {
  labels: Dictionary["pages"]["products"]["list"]["pagination"];
  /** The applied search text; kept in the links so paging does not drop it. */
  query: string;
  page: number;
  pageCount: number;
  pageSize: number;
  /** Products matching the search, across all pages. */
  total: number;
  /** Products on this page. */
  count: number;
}

/** Page 1 needs no parameter. */
function listHref(q: string, page: number): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function ProductsPagination({ labels, query, page, pageCount, pageSize, total, count }: ProductsPaginationProps) {
  const disabled = "pointer-events-none opacity-50";

  return (
    <nav aria-label={labels.label} className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-3 sm:p-4">
      <p className="text-sm text-ink" role="status">
        {format(labels.range, { from: (page - 1) * pageSize + 1, to: (page - 1) * pageSize + count, total })}
      </p>
      {pageCount > 1 && (
        <div className="flex items-center gap-3">
          <ButtonLink
            variant="secondary"
            size="sm"
            href={listHref(query, Math.max(page - 1, 1))}
            rel="prev"
            aria-disabled={page <= 1 || undefined}
            tabIndex={page <= 1 ? -1 : undefined}
            className={page <= 1 ? disabled : ""}
          >
            {labels.prev}
          </ButtonLink>
          <span className="text-sm font-medium text-charcoal">{format(labels.pageOf, { page, pages: pageCount })}</span>
          <ButtonLink
            variant="secondary"
            size="sm"
            href={listHref(query, Math.min(page + 1, pageCount))}
            rel="next"
            aria-disabled={page >= pageCount || undefined}
            tabIndex={page >= pageCount ? -1 : undefined}
            className={page >= pageCount ? disabled : ""}
          >
            {labels.next}
          </ButtonLink>
        </div>
      )}
    </nav>
  );
}

export default ProductsPagination;
