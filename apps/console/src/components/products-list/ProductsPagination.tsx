import ListPagination, { type ListPaginationLabels } from "@/components/ListPagination";
import { productsListHref, type ProductListSort } from "@/lib/products/list-params";

export interface ProductsPaginationProps {
  labels: ListPaginationLabels;
  /** The applied search text; kept in the links so paging does not drop it. */
  query: string;
  /** The applied sort; kept in the links too. */
  sort?: ProductListSort;
  page: number;
  pageCount: number;
  pageSize: number;
  /** Products matching the search, across all pages. */
  total: number;
  /** Products on this page. */
  count: number;
}

export function ProductsPagination({ query, sort, ...rest }: ProductsPaginationProps) {
  return <ListPagination {...rest} getHref={(page) => productsListHref({ q: query, sort, page })} />;
}

export default ProductsPagination;
