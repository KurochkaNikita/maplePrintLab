import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createDb, findExpense, listFinanceOptions } from "@maple-print-lab/db";
import { getDict, getLocale } from "@/lib/i18n/server";
import EditExpenseScreen from "@/screens/expenses/EditExpenseScreen";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).pages.expenses.edit.metaTitle };
}

export default async function EditExpensePage({ params, searchParams }: Params & { searchParams: Promise<{ created?: string }> }) {
  const db = createDb();
  const { id: rawId } = await params;
  if (!/^\d+$/.test(rawId) || !Number.isSafeInteger(Number(rawId))) notFound();

  const [expense, query, t, locale, categories] = await Promise.all([
    findExpense(db, Number(rawId)),
    searchParams,
    getDict(),
    getLocale(),
    listFinanceOptions(db, "expense_category"),
  ]);
  if (!expense) notFound();

  return <EditExpenseScreen t={t} locale={locale} expense={expense} categories={categories} justCreated={query.created === "1"} />;
}
