import { format } from "@/lib/i18n";
import ButtonLink from "@/components/ButtonLink";
import ChevronLeftIcon from "@/icons/chevron-left.svg";
import ChevronRightIcon from "@/icons/chevron-right.svg";

export interface ListPaginationLabels {
  label: string;
  prev: string;
  next: string;
  pageOf: string;
  range: string;
}

export interface ListPaginationProps {
  labels: ListPaginationLabels;
  /** Link to a page of the list (page 1 needs no parameter); keeps whatever filters the list has. */
  getHref: (page: number) => string;
  page: number;
  pageCount: number;
  pageSize: number;
  /** Rows across all pages. */
  total: number;
  /** Rows on this page. */
  count: number;
}

/** "1–20 of 57" with previous/next links. */
export function ListPagination({ labels, getHref, page, pageCount, pageSize, total, count }: ListPaginationProps) {
  const disabled = "pointer-events-none opacity-50";
  const square = "!min-h-11 !w-11 !px-0";

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
            href={getHref(Math.max(page - 1, 1))}
            rel="prev"
            aria-label={labels.prev}
            aria-disabled={page <= 1 || undefined}
            tabIndex={page <= 1 ? -1 : undefined}
            className={`${square} ${page <= 1 ? disabled : ""}`}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </ButtonLink>
          <span className="text-sm font-medium text-charcoal">{format(labels.pageOf, { page, pages: pageCount })}</span>
          <ButtonLink
            variant="secondary"
            size="sm"
            href={getHref(Math.min(page + 1, pageCount))}
            rel="next"
            aria-label={labels.next}
            aria-disabled={page >= pageCount || undefined}
            tabIndex={page >= pageCount ? -1 : undefined}
            className={`${square} ${page >= pageCount ? disabled : ""}`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </ButtonLink>
        </div>
      )}
    </nav>
  );
}

export default ListPagination;
