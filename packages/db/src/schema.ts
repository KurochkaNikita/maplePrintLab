import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** JSON shapes stored in jsonb columns (mirror `src/db/types.ts` of the site). */
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

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

/** Languages are rows, not columns: adding a locale needs no migration. */
export const categories = pgTable("categories", {
  /** URL slug: /<lang>/category/<id>/ */
  id: text("id").primaryKey(),
  customColours: boolean("custom_colours").notNull().default(false),
  priceTiers: jsonb("price_tiers").$type<PriceTier[]>(),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

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
    /** Null when the category has `price_tiers` (the first tier is used). */
    priceAmount: numeric("price_amount", { precision: 10, scale: 2 }),
    priceCurrency: text("price_currency").notNull().default("CAD"),
    priceFrom: boolean("price_from").notNull().default(false),
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
