import type { Metadata } from "next";
import { createDb, listProducts } from "@maple-print-lab/db";
import { getDict } from "@/lib/i18n/server";
import { parseProductSort } from "@/lib/products/list-params";
import { siteUrl } from "@/lib/site-url";
import ProductsScreen from "@/screens/products/ProductsScreen";

const PAGE_SIZE = 20;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.products.metaTitle };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[]; sort?: string | string[]; dir?: string | string[] }>;
}) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const query = first(sp.q).trim().slice(0, 100);

  const sort = parseProductSort(first(sp.sort), first(sp.dir));

  const [t, list] = await Promise.all([
    getDict(),
    listProducts(createDb(), { query, page: Number(first(sp.page)), pageSize: PAGE_SIZE, sort: sort?.key, dir: sort?.dir }),
  ]);

  return (
    <ProductsScreen
      t={t}
      products={list.items}
      total={list.total}
      page={list.page}
      pageCount={list.pageCount}
      pageSize={PAGE_SIZE}
      query={query}
      sort={sort}
      siteUrl={siteUrl}
    />
  );
}
