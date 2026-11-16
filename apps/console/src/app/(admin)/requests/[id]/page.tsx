import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createDb, findOrderRequest } from "@maple-print-lab/db";
import { getDict, getLocale } from "@/lib/i18n/server";
import { isUuid } from "@/lib/order-requests/params";
import RequestScreen from "@/screens/requests/RequestScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.requests.detail.metaTitle };
}

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const [request, t, locale] = await Promise.all([findOrderRequest(createDb(), id), getDict(), getLocale()]);
  if (!request) notFound();

  return <RequestScreen t={t} locale={locale} request={request} />;
}
