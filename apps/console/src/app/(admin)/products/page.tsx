import type { Metadata } from "next";
import { createDb, listProducts } from "@maple-print-lab/db";
import { getDict, getLocale } from "@/lib/i18n/server";
import { siteUrl } from "@/lib/site-url";
import ProductsScreen from "@/screens/products/ProductsScreen";

const PAGE_SIZE = 20;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.products.metaTitle };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
}) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const query = first(sp.q).trim().slice(0, 100);

  const [t, locale, list] = await Promise.all([
    getDict(),
    getLocale(),
    listProducts(createDb(), { query, page: Number(first(sp.page)), pageSize: PAGE_SIZE }),
  ]);

  return (
    <ProductsScreen
      t={t}
      locale={locale}
      products={list.items}
      total={list.total}
      page={list.page}
      pageCount={list.pageCount}
      pageSize={PAGE_SIZE}
      query={query}
      siteUrl={siteUrl}
    />
  );
}
