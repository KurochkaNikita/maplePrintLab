import type { Metadata } from "next";
import { createDb, listExpenses } from "@maple-print-lab/db";
import { getDict, getLocale } from "@/lib/i18n/server";
import ExpensesScreen from "@/screens/expenses/ExpensesScreen";

const PAGE_SIZE = 20;

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.expenses.metaTitle };
}

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const query = await searchParams;
  const [t, locale, list] = await Promise.all([
    getDict(),
    getLocale(),
    listExpenses(createDb(), { page: Number(query.page), pageSize: PAGE_SIZE }),
  ]);

  return (
    <ExpensesScreen t={t} locale={locale} expenses={list.items} total={list.total} page={list.page} pageCount={list.pageCount} pageSize={PAGE_SIZE} />
  );
}
