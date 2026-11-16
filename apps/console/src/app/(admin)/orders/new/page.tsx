import type { Metadata } from "next";
import { createDb, findOrderRequest, listFinanceOptions, listProductSaleOptions } from "@maple-print-lab/db";
import { todayIso } from "@/lib/finance/period";
import { getDict } from "@/lib/i18n/server";
import { isUuid } from "@/lib/order-requests/params";
import NewOrderScreen from "@/screens/orders/NewOrderScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.orders.new.metaTitle };
}

export default async function NewOrderPage({ searchParams }: { searchParams: Promise<{ fromRequest?: string }> }) {
  const { fromRequest } = await searchParams;
  const db = createDb();
  const [t, channels, products, request] = await Promise.all([
    getDict(),
    listFinanceOptions(db, "channel"),
    listProductSaleOptions(db),
    fromRequest && isUuid(fromRequest) ? findOrderRequest(db, fromRequest) : null,
  ]);

  // A request that already became an order is not offered again.
  return <NewOrderScreen t={t} channels={channels} products={products} today={todayIso()} request={request && !request.orderId ? request : undefined} />;
}
