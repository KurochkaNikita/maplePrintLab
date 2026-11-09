import { and, asc, count, desc, eq, gte, lte, max, sql } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import type { Db } from "./client";
import { isUniqueViolation } from "./products";
import {
  expenses,
  financeOptions,
  orderItems,
  orders,
  productTranslations,
  products,
  type FinanceOptionKind,
} from "./schema";

export type { FinanceOptionKind };

/** Pages add up money as numbers: amounts are small and have at most two decimals. */
const money = (value: string | null | undefined) => Number(value ?? 0);

function runBatch(db: Db, statements: BatchItem<"pg">[]) {
  return db.batch(statements as [BatchItem<"pg">, ...BatchItem<"pg">[]]);
}

// ---------------------------------------------------------------------------
// Pick-lists: sales channels and expense categories
// ---------------------------------------------------------------------------

export type FinanceOption = { id: number; name: string; /** Orders or expenses that use it. */ usage: number };

/**
 * Orders reference channels, expenses reference categories. The outer table is named in full on purpose:
 * drizzle prints a bare `"id"` inside a subquery, which would silently mean the inner table's own `id`.
 */
const usageOf = (kind: FinanceOptionKind) =>
  kind === "channel"
    ? sql<number>`(select count(*)::int from ${orders} where ${orders.channelId} = "finance_options"."id")`
    : sql<number>`(select count(*)::int from ${expenses} where ${expenses.categoryId} = "finance_options"."id")`;

export async function listFinanceOptions(db: Db, kind: FinanceOptionKind): Promise<FinanceOption[]> {
  return db
    .select({ id: financeOptions.id, name: financeOptions.name, usage: usageOf(kind) })
    .from(financeOptions)
    .where(eq(financeOptions.kind, kind))
    .orderBy(asc(financeOptions.sortOrder), asc(financeOptions.id));
}

export async function financeOptionExists(db: Db, kind: FinanceOptionKind, id: number): Promise<boolean> {
  const [row] = await db
    .select({ id: financeOptions.id })
    .from(financeOptions)
    .where(and(eq(financeOptions.kind, kind), eq(financeOptions.id, id)))
    .limit(1);
  return !!row;
}

export type FinanceOptionResult = { ok: true } | { ok: false; reason: "taken" | "notFound" | "inUse" };

export async function createFinanceOption(db: Db, kind: FinanceOptionKind, name: string): Promise<FinanceOptionResult> {
  try {
    const [row] = await db.select({ highest: max(financeOptions.sortOrder) }).from(financeOptions).where(eq(financeOptions.kind, kind));
    await db.insert(financeOptions).values({ kind, name, sortOrder: (row?.highest ?? -1) + 1 });
    return { ok: true };
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: false, reason: "taken" };
    throw e;
  }
}

export async function renameFinanceOption(
  db: Db,
  kind: FinanceOptionKind,
  id: number,
  name: string,
): Promise<FinanceOptionResult> {
  try {
    const updated = await db
      .update(financeOptions)
      .set({ name, updatedAt: new Date() })
      .where(and(eq(financeOptions.kind, kind), eq(financeOptions.id, id)))
      .returning({ id: financeOptions.id });
    return updated.length ? { ok: true } : { ok: false, reason: "notFound" };
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: false, reason: "taken" };
    throw e;
  }
}

/** An option that orders or expenses still use cannot be deleted: history would lose its label. */
export async function deleteFinanceOption(db: Db, kind: FinanceOptionKind, id: number): Promise<FinanceOptionResult> {
  const [row] = await db
    .select({ usage: usageOf(kind) })
    .from(financeOptions)
    .where(and(eq(financeOptions.kind, kind), eq(financeOptions.id, id)))
    .limit(1);
  if (!row) return { ok: false, reason: "notFound" };
  if (row.usage > 0) return { ok: false, reason: "inUse" };
  await db.delete(financeOptions).where(and(eq(financeOptions.kind, kind), eq(financeOptions.id, id)));
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Catalogue products as order lines
// ---------------------------------------------------------------------------

export type ProductSaleOption = {
  id: number;
  title: string;
  /** Price of one piece (the first tier for volume pricing), "" when unknown. */
  price: string;
  /** Our cost of one piece, "" when not entered. */
  cost: string;
};

export async function listProductSaleOptions(db: Db): Promise<ProductSaleOption[]> {
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      title: productTranslations.title,
      priceAmount: products.priceAmount,
      priceTiers: products.priceTiers,
      costAmount: products.costAmount,
    })
    .from(products)
    .leftJoin(productTranslations, and(eq(productTranslations.productId, products.id), eq(productTranslations.locale, "en")))
    .orderBy(asc(products.sortOrder), asc(products.id));
  return rows.map((r) => ({
    id: r.id,
    title: r.title ?? r.slug,
    price: r.priceAmount ?? (r.priceTiers?.[0] ? r.priceTiers[0].amount.toFixed(2) : ""),
    cost: r.costAmount ?? "",
  }));
}

export async function productExists(db: Db, id: number): Promise<boolean> {
  const [row] = await db.select({ id: products.id }).from(products).where(eq(products.id, id)).limit(1);
  return !!row;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export type OrderItemInput = {
  /** Null for a custom item. */
  productId: number | null;
  description: string;
  quantity: number;
  /** Decimal string, price of one piece. */
  unitPrice: string;
  /** Decimal string, our cost of one piece. */
  unitCost: string;
};

export type OrderInput = {
  /** YYYY-MM-DD */
  orderedOn: string;
  channelId: number;
  note: string;
  items: OrderItemInput[];
};

export type OrderRecord = OrderInput & { id: string };

export type OrderListItem = {
  id: string;
  orderedOn: string;
  channelName: string;
  note: string;
  /** Line descriptions joined with commas. */
  summary: string;
  revenue: number;
  cost: number;
};

export type Page<T> = { items: T[]; total: number; page: number; pageCount: number };

const lineRevenue = sql`${orderItems.quantity} * ${orderItems.unitPrice}`;
const lineCost = sql`${orderItems.quantity} * ${orderItems.unitCost}`;

function clampPage(total: number, page: number, pageSize: number) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return { pageCount, current: Math.min(Math.max(1, Math.floor(page) || 1), pageCount) };
}

export async function listOrders(db: Db, { page = 1, pageSize = 20 }: { page?: number; pageSize?: number } = {}): Promise<Page<OrderListItem>> {
  const [{ total }] = await db.select({ total: count() }).from(orders);
  const { pageCount, current } = clampPage(total, page, pageSize);

  const rows = await db
    .select({
      id: orders.id,
      orderedOn: orders.orderedOn,
      channelName: financeOptions.name,
      note: orders.note,
      summary: sql<string>`coalesce(string_agg(${orderItems.description}, ', ' order by ${orderItems.id}), '')`,
      revenue: sql<string>`coalesce(sum(${lineRevenue}), 0)`,
      cost: sql<string>`coalesce(sum(${lineCost}), 0)`,
    })
    .from(orders)
    .innerJoin(financeOptions, eq(financeOptions.id, orders.channelId))
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .groupBy(orders.id, financeOptions.name)
    .orderBy(desc(orders.orderedOn), desc(orders.createdAt))
    .limit(pageSize)
    .offset((current - 1) * pageSize);

  return {
    items: rows.map((r) => ({ ...r, revenue: money(r.revenue), cost: money(r.cost) })),
    total,
    page: current,
    pageCount,
  };
}

export async function findOrder(db: Db, id: string): Promise<OrderRecord | null> {
  const [row] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!row) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id)).orderBy(asc(orderItems.id));
  return {
    id: row.id,
    orderedOn: row.orderedOn,
    channelId: row.channelId,
    note: row.note,
    items: items.map((i) => ({
      productId: i.productId,
      description: i.description,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      unitCost: i.unitCost,
    })),
  };
}

function itemRows(orderId: string, input: OrderInput) {
  return input.items.map((item) => ({ orderId, ...item }));
}

/** The order and its lines in one atomic batch; the id is generated here so the lines can point at it. */
export async function createOrder(db: Db, input: OrderInput): Promise<string> {
  const id = crypto.randomUUID();
  await runBatch(db, [
    db.insert(orders).values({ id, orderedOn: input.orderedOn, channelId: input.channelId, note: input.note }),
    db.insert(orderItems).values(itemRows(id, input)),
  ]);
  return id;
}

/** Returns false when the order does not exist. */
export async function updateOrder(db: Db, id: string, input: OrderInput): Promise<boolean> {
  const [current] = await db.select({ id: orders.id }).from(orders).where(eq(orders.id, id)).limit(1);
  if (!current) return false;
  await runBatch(db, [
    db
      .update(orders)
      .set({ orderedOn: input.orderedOn, channelId: input.channelId, note: input.note, updatedAt: new Date() })
      .where(eq(orders.id, id)),
    db.delete(orderItems).where(eq(orderItems.orderId, id)),
    db.insert(orderItems).values(itemRows(id, input)),
  ]);
  return true;
}

export async function deleteOrder(db: Db, id: string): Promise<boolean> {
  const deleted = await db.delete(orders).where(eq(orders.id, id)).returning({ id: orders.id });
  return deleted.length > 0;
}

// ---------------------------------------------------------------------------
// Expenses
// ---------------------------------------------------------------------------

export type ExpenseInput = {
  /** YYYY-MM-DD */
  spentOn: string;
  categoryId: number;
  description: string;
  /** Decimal string. */
  amount: string;
};

export type ExpenseRecord = ExpenseInput & { id: number };

export type ExpenseListItem = {
  id: number;
  spentOn: string;
  categoryName: string;
  description: string;
  amount: number;
};

export async function listExpenses(db: Db, { page = 1, pageSize = 20 }: { page?: number; pageSize?: number } = {}): Promise<Page<ExpenseListItem>> {
  const [{ total }] = await db.select({ total: count() }).from(expenses);
  const { pageCount, current } = clampPage(total, page, pageSize);

  const rows = await db
    .select({
      id: expenses.id,
      spentOn: expenses.spentOn,
      categoryName: financeOptions.name,
      description: expenses.description,
      amount: expenses.amount,
    })
    .from(expenses)
    .innerJoin(financeOptions, eq(financeOptions.id, expenses.categoryId))
    .orderBy(desc(expenses.spentOn), desc(expenses.id))
    .limit(pageSize)
    .offset((current - 1) * pageSize);

  return { items: rows.map((r) => ({ ...r, amount: money(r.amount) })), total, page: current, pageCount };
}

export async function findExpense(db: Db, id: number): Promise<ExpenseRecord | null> {
  const [row] = await db.select().from(expenses).where(eq(expenses.id, id)).limit(1);
  return row
    ? { id: row.id, spentOn: row.spentOn, categoryId: row.categoryId, description: row.description, amount: row.amount }
    : null;
}

export async function createExpense(db: Db, input: ExpenseInput): Promise<number> {
  const [row] = await db.insert(expenses).values(input).returning({ id: expenses.id });
  return row.id;
}

export async function updateExpense(db: Db, id: number, input: ExpenseInput): Promise<boolean> {
  const updated = await db
    .update(expenses)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(expenses.id, id))
    .returning({ id: expenses.id });
  return updated.length > 0;
}

export async function deleteExpense(db: Db, id: number): Promise<boolean> {
  const deleted = await db.delete(expenses).where(eq(expenses.id, id)).returning({ id: expenses.id });
  return deleted.length > 0;
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export type Granularity = "day" | "week" | "month";

export type FinanceSeriesPoint = {
  /** First day of the bucket, YYYY-MM-DD. Buckets without activity are missing: the caller fills the gaps. */
  bucket: string;
  income: number;
  itemCost: number;
  expenses: number;
};

export type FinanceSummary = {
  /** Sum of quantity × price of all lines. */
  income: number;
  /** Sum of quantity × our unit cost of all lines. */
  itemCost: number;
  /** Sum of expenses. */
  expenses: number;
  orderCount: number;
  series: FinanceSeriesPoint[];
  byChannel: { name: string; income: number; profit: number }[];
  topItems: { description: string; quantity: number; income: number; profit: number }[];
  expensesByCategory: { name: string; amount: number }[];
};

export async function getFinanceSummary(
  db: Db,
  { from, to, granularity }: { from: string; to: string; granularity: Granularity },
): Promise<FinanceSummary> {
  // `granularity` is interpolated as SQL: only these three words are ever allowed.
  const unit = granularity === "day" ? "day" : granularity === "week" ? "week" : "month";
  const bucketOf = (column: typeof orders.orderedOn | typeof expenses.spentOn) =>
    sql<string>`to_char(date_trunc('${sql.raw(unit)}', ${column}::timestamp), 'YYYY-MM-DD')`;

  const orderRange = and(gte(orders.orderedOn, from), lte(orders.orderedOn, to));
  const expenseRange = and(gte(expenses.spentOn, from), lte(expenses.spentOn, to));

  const [salesByBucket, expensesByBucket, orderCounts, byChannel, topItems, expensesByCategory] = await Promise.all([
    db
      .select({
        bucket: bucketOf(orders.orderedOn),
        income: sql<string>`coalesce(sum(${lineRevenue}), 0)`,
        itemCost: sql<string>`coalesce(sum(${lineCost}), 0)`,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .where(orderRange)
      .groupBy(sql`1`),
    db
      .select({ bucket: bucketOf(expenses.spentOn), amount: sql<string>`coalesce(sum(${expenses.amount}), 0)` })
      .from(expenses)
      .where(expenseRange)
      .groupBy(sql`1`),
    db.select({ total: count() }).from(orders).where(orderRange),
    db
      .select({
        name: financeOptions.name,
        income: sql<string>`coalesce(sum(${lineRevenue}), 0)`,
        itemCost: sql<string>`coalesce(sum(${lineCost}), 0)`,
      })
      .from(orders)
      .innerJoin(financeOptions, eq(financeOptions.id, orders.channelId))
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .where(orderRange)
      .groupBy(financeOptions.name)
      .orderBy(desc(sql`sum(${lineRevenue})`)),
    db
      .select({
        description: orderItems.description,
        quantity: sql<string>`sum(${orderItems.quantity})`,
        income: sql<string>`sum(${lineRevenue})`,
        itemCost: sql<string>`sum(${lineCost})`,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .where(orderRange)
      .groupBy(orderItems.description)
      .orderBy(desc(sql`sum(${lineRevenue})`))
      .limit(5),
    db
      .select({ name: financeOptions.name, amount: sql<string>`coalesce(sum(${expenses.amount}), 0)` })
      .from(expenses)
      .innerJoin(financeOptions, eq(financeOptions.id, expenses.categoryId))
      .where(expenseRange)
      .groupBy(financeOptions.name)
      .orderBy(desc(sql`sum(${expenses.amount})`)),
  ]);

  const points = new Map<string, FinanceSeriesPoint>();
  const point = (bucket: string) => {
    let p = points.get(bucket);
    if (!p) points.set(bucket, (p = { bucket, income: 0, itemCost: 0, expenses: 0 }));
    return p;
  };
  for (const r of salesByBucket) Object.assign(point(r.bucket), { income: money(r.income), itemCost: money(r.itemCost) });
  for (const r of expensesByBucket) point(r.bucket).expenses = money(r.amount);

  const series = [...points.values()].sort((a, b) => a.bucket.localeCompare(b.bucket));
  return {
    income: series.reduce((sum, p) => sum + p.income, 0),
    itemCost: series.reduce((sum, p) => sum + p.itemCost, 0),
    expenses: series.reduce((sum, p) => sum + p.expenses, 0),
    orderCount: orderCounts[0]?.total ?? 0,
    series,
    byChannel: byChannel.map((r) => ({ name: r.name, income: money(r.income), profit: money(r.income) - money(r.itemCost) })),
    topItems: topItems.map((r) => ({
      description: r.description,
      quantity: Number(r.quantity),
      income: money(r.income),
      profit: money(r.income) - money(r.itemCost),
    })),
    expensesByCategory: expensesByCategory.map((r) => ({ name: r.name, amount: money(r.amount) })),
  };
}

/** Totals per day with activity over all time, oldest first. The caller turns them into running totals. */
export async function getFinanceHistory(db: Db): Promise<FinanceSeriesPoint[]> {
  const [sales, spent] = await Promise.all([
    db
      .select({
        day: orders.orderedOn,
        income: sql<string>`coalesce(sum(${lineRevenue}), 0)`,
        itemCost: sql<string>`coalesce(sum(${lineCost}), 0)`,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .groupBy(orders.orderedOn),
    db.select({ day: expenses.spentOn, amount: sql<string>`coalesce(sum(${expenses.amount}), 0)` }).from(expenses).groupBy(expenses.spentOn),
  ]);
  const days = new Map<string, FinanceSeriesPoint>();
  const day = (bucket: string) => {
    let p = days.get(bucket);
    if (!p) days.set(bucket, (p = { bucket, income: 0, itemCost: 0, expenses: 0 }));
    return p;
  };
  for (const r of sales) Object.assign(day(r.day), { income: money(r.income), itemCost: money(r.itemCost) });
  for (const r of spent) day(r.day).expenses = money(r.amount);
  return [...days.values()].sort((a, b) => a.bucket.localeCompare(b.bucket));
}
