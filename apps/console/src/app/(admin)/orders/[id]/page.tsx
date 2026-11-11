import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createDb, findOrder, listFinanceOptions, listProductSaleOptions } from "@maple-print-lab/db";
import { getDict, getLocale } from "@/lib/i18n/server";
import EditOrderScreen from "@/screens/orders/EditOrderScreen";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.orders.edit.metaTitle };
}

export default async function EditOrderPage({ params }: Params) {
  const db = createDb();
  const { id } = await params;
  // Not a UUID: no need to ask the database.
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const [order, t, locale, channels, products] = await Promise.all([
    findOrder(db, id),
    getDict(),
    getLocale(),
    listFinanceOptions(db, "channel"),
    listProductSaleOptions(db),
  ]);
  if (!order) notFound();

  return <EditOrderScreen t={t} locale={locale} order={order} channels={channels} products={products} />;
}
