import type { Metadata } from "next";
import { createDb, listOrders } from "@maple-print-lab/db";
import { parseStatusDir } from "@/lib/finance/list-params";
import { getDict, getLocale } from "@/lib/i18n/server";
import OrdersScreen from "@/screens/orders/OrdersScreen";

const PAGE_SIZE = 20;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.orders.metaTitle };
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  const query = await searchParams;
  const statusDir = parseStatusDir(query.status);
  const [t, locale, list] = await Promise.all([
    getDict(),
    getLocale(),
    listOrders(createDb(), { page: Number(query.page), pageSize: PAGE_SIZE, statusDir }),
  ]);

  return (
    <OrdersScreen t={t} locale={locale} statusDir={statusDir} orders={list.items} total={list.total} page={list.page} pageCount={list.pageCount} pageSize={PAGE_SIZE} />
  );
}
