import type { Metadata } from "next";
import { countNewOrderRequests, countOrderStages, createDb, getFinanceSummary, listOpenOrders, listPopularItems } from "@maple-print-lab/db";
import { previousMonthRange } from "@/lib/dashboard/stats";
import { periodRange, todayIso } from "@/lib/finance/period";
import { getDict, getLocale } from "@/lib/i18n/server";
import DashboardScreen from "@/screens/dashboard/DashboardScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.dashboard.metaTitle };
}

export default async function DashboardPage() {
  const today = todayIso();
  const month = periodRange("d30", today);

  const db = createDb();
  const [t, locale, newRequests, stages, queue, current, previous, popular] = await Promise.all([
    getDict(),
    getLocale(),
    // As in the layout badge: requests that cannot be counted must not take the whole home page down.
    countNewOrderRequests(db).catch((e) => {
      console.error("countNewOrderRequests failed", e);
      return 0;
    }),
    countOrderStages(db),
    listOpenOrders(db),
    getFinanceSummary(db, month),
    getFinanceSummary(db, previousMonthRange(today)),
    listPopularItems(db, month),
  ]);

  return (
    <DashboardScreen
      t={t}
      locale={locale}
      today={today}
      newRequests={newRequests}
      stages={stages}
      queue={queue}
      current={current}
      previous={previous}
      popular={popular}
    />
  );
}
