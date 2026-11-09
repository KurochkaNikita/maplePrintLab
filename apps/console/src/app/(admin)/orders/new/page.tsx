import type { Metadata } from "next";
import { createDb, listFinanceOptions, listProductSaleOptions } from "@maple-print-lab/db";
import { todayIso } from "@/lib/finance/period";
import { getDict } from "@/lib/i18n/server";
import NewOrderScreen from "@/screens/orders/NewOrderScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.orders.new.metaTitle };
}

export default async function NewOrderPage() {
  const db = createDb();
  const [t, channels, products] = await Promise.all([getDict(), listFinanceOptions(db, "channel"), listProductSaleOptions(db)]);

  return <NewOrderScreen t={t} channels={channels} products={products} today={todayIso()} />;
}
