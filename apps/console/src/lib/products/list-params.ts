import type { ProductSortKey, SortDirection } from "@maple-print-lab/db";

export const PRODUCT_SORT_KEYS = ["title", "collection", "category"] as const satisfies readonly ProductSortKey[];

export interface ProductListSort {
  key: ProductSortKey;
  dir: SortDirection;
}

/** Reads `?sort=&dir=`; anything unknown means "no sorting" (the manual catalogue order). */
export function parseProductSort(sort: string, dir: string): ProductListSort | undefined {
  const key = PRODUCT_SORT_KEYS.find((k) => k === sort);
  if (!key) return undefined;
  return { key, dir: dir === "desc" ? "desc" : "asc" };
}

/** Link to a page of the products list that keeps the search and the sort; page 1 needs no parameter. */
export function productsListHref({ q, sort, page }: { q?: string; sort?: ProductListSort; page?: number }): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (sort) {
    params.set("sort", sort.key);
    params.set("dir", sort.dir);
  }
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

/** Clicking a column sorts ascending first, then flips the direction. */
export function nextProductSort(current: ProductListSort | undefined, key: ProductSortKey): ProductListSort {
  return { key, dir: current?.key === key && current.dir === "asc" ? "desc" : "asc" };
}
