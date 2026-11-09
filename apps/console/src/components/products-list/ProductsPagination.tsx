import ListPagination, { type ListPaginationLabels } from "@/components/ListPagination";

export interface ProductsPaginationProps {
  labels: ListPaginationLabels;
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

export function ProductsPagination({ query, ...rest }: ProductsPaginationProps) {
  return <ListPagination {...rest} getHref={(page) => listHref(query, page)} />;
}

export default ProductsPagination;
