import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { ORDER_REQUEST_STATUSES, type OrderRequestStatus } from "./order-request-status";
import { ORDER_STATUSES, type OrderStatus } from "./order-status";

/** JSON shapes stored in jsonb columns. */
export type PriceTier = { from: number; to?: number; amount: number };
export type SeoBlockJson = {
  sections: { heading: string; paragraphs: string[] }[];
  faq: { q: string; a: string }[];
};
export type Dimensions = {
  cm: [number, number, number];
  in: [number, number, number];
};
export type Highlight = { title: string; text: string };
/** Category cover: a Blob URL (or bare file name from the site), its size, and alt text per locale. */
export type CategoryCover = {
  file: string;
  width: number;
  height: number;
  alts: Record<string, string>;
};

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

/** Languages are rows, not columns: adding a locale needs no migration. */
export const categories = pgTable(
  "categories",
  {
    /** URL slug: /<lang>/category/<id>/ */
    id: text("id").primaryKey(),
    customColours: boolean("custom_colours").notNull().default(false),
    /** Optional cover shown on category cards and headers. */
    cover: jsonb("cover").$type<CategoryCover>(),
    /** The one fallback category: products of a deleted category move here. It cannot be deleted. */
    isDefault: boolean("is_default").notNull().default(false),
    published: boolean("published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex("categories_default_uq").on(t.isDefault).where(sql`${t.isDefault}`)],
);

export const categoryTranslations = pgTable(
  "category_translations",
  {
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade", onUpdate: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    intro: text("intro").notNull(),
    highlight: text("highlight"),
    seoTitle: text("seo_title").notNull(),
    seoDescription: text("seo_description").notNull(),
    seoBlock: jsonb("seo_block").$type<SeoBlockJson>(),
  },
  (t) => [primaryKey({ columns: [t.categoryId, t.locale] })],
);

export const collections = pgTable("collections", {
  /** URL slug: /<lang>/collection/<id>/ */
  id: text("id").primaryKey(),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const collectionTranslations = pgTable(
  "collection_translations",
  {
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade", onUpdate: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    intro: text("intro").notNull(),
    seoTitle: text("seo_title").notNull(),
    seoDescription: text("seo_description").notNull(),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.locale] })],
);

export const products = pgTable(
  "products",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    /** URL slug: /<lang>/product/<slug>/. Changing it needs a row in `redirects`. */
    slug: text("slug").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onUpdate: "cascade" }),
    isNew: boolean("is_new").notNull().default(false),
    /** Null when the product has `price_tiers` (the first tier is used). */
    priceAmount: numeric("price_amount", { precision: 10, scale: 2 }),
    /** Volume pricing of this product; shown as a table on its page. */
    priceTiers: jsonb("price_tiers").$type<PriceTier[]>(),
    priceCurrency: text("price_currency").notNull().default("CAD"),
    priceFrom: boolean("price_from").notNull().default(false),
    /** What one piece costs us to make (material, power, packaging). Null = not entered yet. Prefills new order lines. */
    costAmount: numeric("cost_amount", { precision: 10, scale: 2 }),
    dimensions: jsonb("dimensions").$type<Dimensions>().notNull(),
    published: boolean("published").notNull().default(true),
    /** Page stays live but gets `noindex` and is left out of the sitemap. */
    noindex: boolean("noindex").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("products_slug_uq").on(t.slug),
    index("products_category_idx").on(t.categoryId),
  ],
);

export const productTranslations = pgTable(
  "product_translations",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    note: text("note").notNull(),
    description: text("description").notNull(),
    material: text("material").notNull(),
    highlights: jsonb("highlights").$type<Highlight[]>().notNull().default([]),
    seoTitle: text("seo_title").notNull(),
    seoDescription: text("seo_description").notNull(),
  },
  (t) => [primaryKey({ columns: [t.productId, t.locale] })],
);

export const productImages = pgTable(
  "product_images",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** 0 = main image. */
    position: integer("position").notNull(),
    /** File name under public/product/<slug>/ (later: Blob URL). */
    file: text("file").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    /** Alt text per locale: { en: "...", fr: "..." }. */
    alts: jsonb("alts").$type<Record<string, string>>().notNull().default({}),
  },
  (t) => [uniqueIndex("product_images_pos_uq").on(t.productId, t.position)],
);

export const productCollections = pgTable(
  "product_collections",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.productId, t.collectionId] })],
);

/** Old path -> new path, written to the host config at build time. */
export const redirects = pgTable("redirects", {
  fromPath: text("from_path").primaryKey(),
  toPath: text("to_path").notNull(),
  permanent: boolean("permanent").notNull().default(true),
  ...timestamps,
});

/** Editable pick-lists of the finance section: where a sale came from, what an expense was for. */
export const FINANCE_OPTION_KINDS = ["channel", "expense_category"] as const;
export type FinanceOptionKind = (typeof FINANCE_OPTION_KINDS)[number];

export const financeOptions = pgTable(
  "finance_options",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    kind: text("kind").$type<FinanceOptionKind>().notNull(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex("finance_options_kind_name_uq").on(t.kind, t.name)],
);

export { ORDER_STATUSES, type OrderStatus };
export const orderStatus = pgEnum("order_status", ORDER_STATUSES);

/** A sale. The id is generated by the app so order lines can be written in the same batch. */
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderedOn: date("ordered_on", { mode: "string" }).notNull(),
    /** `finance_options` row of kind `channel`. */
    channelId: integer("channel_id")
      .notNull()
      .references(() => financeOptions.id, { onDelete: "restrict" }),
    note: text("note").notNull().default(""),
    /** Null while no status is chosen. */
    status: orderStatus("status"),
    ...timestamps,
  },
  (t) => [index("orders_ordered_on_idx").on(t.orderedOn)],
);

/** One line of an order. Price, cost and description are copied at the time of sale, so later catalogue edits do not rewrite history. */
export const orderItems = pgTable(
  "order_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    /** Null for a custom item, or when the catalogue product was deleted. */
    productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
    description: text("description").notNull(),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    unitCost: numeric("unit_cost", { precision: 10, scale: 2 }).notNull().default("0"),
  },
  (t) => [index("order_items_order_idx").on(t.orderId), index("order_items_product_idx").on(t.productId)],
);

/** Money spent that is not the per-piece cost of a sold item (equipment, ads, packaging stock, fees). */
export const expenses = pgTable(
  "expenses",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    spentOn: date("spent_on", { mode: "string" }).notNull(),
    /** `finance_options` row of kind `expense_category`. */
    categoryId: integer("category_id")
      .notNull()
      .references(() => financeOptions.id, { onDelete: "restrict" }),
    description: text("description").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    ...timestamps,
  },
  (t) => [index("expenses_spent_on_idx").on(t.spentOn)],
);

/** Lifecycle of a customer enquiry from the product page. */
export { ORDER_REQUEST_STATUSES, type OrderRequestStatus };
export const orderRequestStatus = pgEnum("order_request_status", ORDER_REQUEST_STATUSES);

/**
 * An enquiry left through the "Order this piece" dialog on the public site. Not an `orders` row: those are
 * sales for the finance section; a request becomes one only when the admin converts it (`orderId`).
 */
export const orderRequests = pgTable(
  "order_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    status: orderRequestStatus("status").notNull().default("new"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    message: text("message"),
    /** Language of the page the customer wrote from. */
    locale: text("locale").$type<"en" | "fr">().notNull(),
    /** sha256(ip + IP_HASH_SALT); the address itself is never stored. */
    ipHash: text("ip_hash").notNull(),
    /** Set when the request is converted into a sale. */
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  },
  (t) => [
    index("order_requests_created_idx").on(t.createdAt),
    index("order_requests_status_idx").on(t.status),
    index("order_requests_ip_created_idx").on(t.ipHash, t.createdAt),
  ],
);

/** One line of a request. Title and price are copied at the time of the request, so later catalogue edits do not rewrite it. */
export const orderRequestItems = pgTable(
  "order_request_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    requestId: uuid("request_id")
      .notNull()
      .references(() => orderRequests.id, { onDelete: "cascade" }),
    /** Null once the product is deleted; the snapshot below stays. */
    productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
    productSlug: text("product_slug").notNull(),
    productTitle: text("product_title").notNull(),
    productPrice: numeric("product_price", { precision: 10, scale: 2 }),
    quantity: integer("quantity").notNull().default(1),
  },
  (t) => [index("order_request_items_request_idx").on(t.requestId)],
);
