import type { Metadata } from "next";
import { createDb, listFinanceOptions } from "@maple-print-lab/db";
import { todayIso } from "@/lib/finance/period";
import { getDict } from "@/lib/i18n/server";
import NewExpenseScreen from "@/screens/expenses/NewExpenseScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.expenses.new.metaTitle };
}

export default async function NewExpensePage() {
  const [t, categories] = await Promise.all([getDict(), listFinanceOptions(createDb(), "expense_category")]);

  return <NewExpenseScreen t={t} categories={categories} today={todayIso()} />;
}
