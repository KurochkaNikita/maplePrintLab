import type { Metadata } from "next";
import { countOrderRequestsByStatus, createDb, listOrderRequests } from "@maple-print-lab/db";
import { getDict, getLocale } from "@/lib/i18n/server";
import { isRequestStatus } from "@/lib/order-requests/params";
import RequestsScreen from "@/screens/requests/RequestsScreen";

const PAGE_SIZE = 20;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.requests.metaTitle };
}

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const query = await searchParams;
  const status = isRequestStatus(query.status) ? query.status : undefined;
  const db = createDb();
  const [t, locale, list, counts] = await Promise.all([
    getDict(),
    getLocale(),
    listOrderRequests(db, { status, page: Number(query.page), pageSize: PAGE_SIZE }),
    countOrderRequestsByStatus(db),
  ]);

  return (
    <RequestsScreen t={t} locale={locale} requests={list.items} counts={counts} status={status} total={list.total} page={list.page} pageCount={list.pageCount} pageSize={PAGE_SIZE} />
  );
}
