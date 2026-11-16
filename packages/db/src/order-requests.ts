import { and, asc, count, desc, eq, gte, inArray } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import type { Db } from "./client";
import { clampPage, type Page } from "./finance";
import type { OrderRequestInput } from "./order-request-validation";
import { ORDER_REQUEST_STATUSES, type OrderRequestStatus } from "./order-request-status";
import { orderRequestItems, orderRequests, productTranslations, products } from "./schema";

/** A published product as the request form needs it: title in the customer's language, price of one piece. */
export type RequestableProduct = { id: number; slug: string; title: string; price: string | null };

/** Title and price come from here, never from the browser. Unknown or unpublished slugs are simply missing from the result. */
export async function findRequestableProducts(db: Db, slugs: string[], locale: string): Promise<RequestableProduct[]> {
  if (!slugs.length) return [];
  const rows = await db
    .select({ id: products.id, slug: products.slug, priceAmount: products.priceAmount, priceTiers: products.priceTiers })
    .from(products)
    .where(and(inArray(products.slug, slugs), eq(products.published, true)));
  if (!rows.length) return [];

  const texts = await db
    .select()
    .from(productTranslations)
    .where(inArray(productTranslations.productId, rows.map((row) => row.id)));
  return rows.map((row) => {
    const own = texts.filter((t) => t.productId === row.id);
    const title = (own.find((t) => t.locale === locale) ?? own.find((t) => t.locale === "en"))?.title ?? row.slug;
    return {
      id: row.id,
      slug: row.slug,
      title,
      price: row.priceAmount ?? (row.priceTiers?.[0] ? row.priceTiers[0].amount.toFixed(2) : null),
    };
  });
}

/** Requests from one hashed address since `since`, for the hourly limit. */
export async function countRequestsSince(db: Db, ipHash: string, since: Date): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(orderRequests)
    .where(and(eq(orderRequests.ipHash, ipHash), gte(orderRequests.createdAt, since)));
  return row.total;
}

export type NewOrderRequestItem = RequestableProduct & { quantity: number };

export type NewOrderRequest = Omit<OrderRequestInput, "items"> & {
  items: NewOrderRequestItem[];
  ipHash: string;
};

/** Saves the request and its lines together (one batch: neon-http has no interactive transactions). */
export async function createOrderRequest(db: Db, input: NewOrderRequest): Promise<{ id: string; createdAt: Date }> {
  // The id is made here so the lines can reference it inside the same batch.
  const id = crypto.randomUUID();
  const statements: BatchItem<"pg">[] = [
    db
      .insert(orderRequests)
      .values({
        id,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        message: input.message,
        locale: input.locale,
        ipHash: input.ipHash,
      })
      .returning({ id: orderRequests.id, createdAt: orderRequests.createdAt }),
    db.insert(orderRequestItems).values(
      input.items.map((item) => ({
        requestId: id,
        productId: item.id,
        productSlug: item.slug,
        productTitle: item.title,
        productPrice: item.price,
        quantity: item.quantity,
      })),
    ),
  ];
  const [[row]] = (await db.batch(statements as [BatchItem<"pg">, ...BatchItem<"pg">[]])) as [{ id: string; createdAt: Date }[], unknown];
  return row;
}

/** Everything about a request except the address hash, which no screen needs. */
export type OrderRequestRecord = {
  id: string;
  createdAt: Date;
  status: OrderRequestStatus;
  firstName: string;
  lastName: string;
  email: string;
  message: string | null;
  locale: "en" | "fr";
  orderId: string | null;
  items: OrderRequestItemRecord[];
};

export type OrderRequestItemRecord = {
  id: number;
  /** Null once the product is deleted from the catalogue. */
  productId: number | null;
  productSlug: string;
  productTitle: string;
  productPrice: string | null;
  quantity: number;
};

const columns = {
  id: orderRequests.id,
  createdAt: orderRequests.createdAt,
  status: orderRequests.status,
  firstName: orderRequests.firstName,
  lastName: orderRequests.lastName,
  email: orderRequests.email,
  message: orderRequests.message,
  locale: orderRequests.locale,
  orderId: orderRequests.orderId,
};

/** Adds the lines to request rows (one query for all of them). */
async function withItems(db: Db, rows: Omit<OrderRequestRecord, "items">[]): Promise<OrderRequestRecord[]> {
  if (!rows.length) return [];
  const lines = await db
    .select()
    .from(orderRequestItems)
    .where(inArray(orderRequestItems.requestId, rows.map((row) => row.id)))
    .orderBy(asc(orderRequestItems.id));
  return rows.map((row) => ({
    ...row,
    items: lines
      .filter((line) => line.requestId === row.id)
      .map(({ requestId: _requestId, ...line }) => line),
  }));
}

export async function listOrderRequests(
  db: Db,
  { status, page = 1, pageSize = 20 }: { status?: OrderRequestStatus; page?: number; pageSize?: number } = {},
): Promise<Page<OrderRequestRecord>> {
  const where = status ? eq(orderRequests.status, status) : undefined;
  const [{ total }] = await db.select({ total: count() }).from(orderRequests).where(where);
  const { pageCount, current } = clampPage(total, page, pageSize);
  const rows = await db
    .select(columns)
    .from(orderRequests)
    .where(where)
    .orderBy(desc(orderRequests.createdAt))
    .limit(pageSize)
    .offset((current - 1) * pageSize);
  return { items: await withItems(db, rows), total, page: current, pageCount };
}

/** Requests per status, for the filter and the badge in the navigation. */
export async function countOrderRequestsByStatus(db: Db): Promise<Record<OrderRequestStatus, number>> {
  const rows = await db.select({ status: orderRequests.status, total: count() }).from(orderRequests).groupBy(orderRequests.status);
  const result = Object.fromEntries(ORDER_REQUEST_STATUSES.map((s) => [s, 0])) as Record<OrderRequestStatus, number>;
  for (const row of rows) result[row.status] = row.total;
  return result;
}

export async function countNewOrderRequests(db: Db): Promise<number> {
  const [row] = await db.select({ total: count() }).from(orderRequests).where(eq(orderRequests.status, "new"));
  return row.total;
}

export async function findOrderRequest(db: Db, id: string): Promise<OrderRequestRecord | null> {
  const [row] = await db.select(columns).from(orderRequests).where(eq(orderRequests.id, id)).limit(1);
  if (!row) return null;
  return (await withItems(db, [row]))[0];
}

/** Changes only the status. Returns false when the request does not exist. */
export async function setOrderRequestStatus(db: Db, id: string, status: OrderRequestStatus): Promise<boolean> {
  const rows = await db.update(orderRequests).set({ status }).where(eq(orderRequests.id, id)).returning({ id: orderRequests.id });
  return rows.length > 0;
}
