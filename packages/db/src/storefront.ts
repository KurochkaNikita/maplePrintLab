import { asc, eq } from "drizzle-orm";
import type { Db } from "./client";
import {
  categories,
  categoryTranslations,
  productImages,
  productTranslations,
  products,
  type Dimensions,
  type PriceTier,
} from "./schema";
import { PRODUCT_LOCALES } from "./locales";
import type { CategoryRecord } from "./categories";
import type { ProductRecord } from "./products";

/** What the public site reads at build time: published rows only, every language, no admin-only fields. */
export type StorefrontCategory = {
  id: string;
  customColours: boolean;
  sortOrder: number;
  updatedAt: Date;
  translations: CategoryRecord["translations"];
};

export type StorefrontProduct = {
  slug: string;
  categoryId: string;
  isNew: boolean;
  noindex: boolean;
  sortOrder: number;
  /** Null when the product has price tiers. */
  priceAmount: number | null;
  priceTiers: PriceTier[] | null;
  priceFrom: boolean;
  dimensions: Dimensions;
  updatedAt: Date;
  /** Main photo first. `file` is a Blob URL or a bare file name under `public/product/<slug>/`. */
  images: ProductRecord["images"];
  translations: ProductRecord["translations"];
};

export type Storefront = { categories: StorefrontCategory[]; products: StorefrontProduct[] };

/** Published categories and products with their translations and photos, in display order (a handful of queries). */
export async function loadStorefront(db: Db): Promise<Storefront> {
  const [categoryRows, categoryTextRows, productRows, productTextRows, imageRows] = await Promise.all([
    db.select().from(categories).where(eq(categories.published, true)).orderBy(asc(categories.sortOrder), asc(categories.id)),
    db.select().from(categoryTranslations),
    db.select().from(products).where(eq(products.published, true)).orderBy(asc(products.sortOrder), asc(products.id)),
    db.select().from(productTranslations),
    db.select().from(productImages).orderBy(asc(productImages.productId), asc(productImages.position)),
  ]);

  return {
    categories: categoryRows.map((row) => {
      const translations: StorefrontCategory["translations"] = {};
      for (const locale of PRODUCT_LOCALES) {
        const tr = categoryTextRows.find((r) => r.categoryId === row.id && r.locale === locale);
        if (tr) {
          translations[locale] = {
            title: tr.title,
            intro: tr.intro,
            highlight: tr.highlight,
            seoTitle: tr.seoTitle,
            seoDescription: tr.seoDescription,
            seoBlock: tr.seoBlock,
          };
        }
      }
      return {
        id: row.id,
        customColours: row.customColours,
        sortOrder: row.sortOrder,
        updatedAt: row.updatedAt,
        translations,
      };
    }),
    products: productRows.map((row) => {
      const translations: StorefrontProduct["translations"] = {};
      for (const locale of PRODUCT_LOCALES) {
        const tr = productTextRows.find((r) => r.productId === row.id && r.locale === locale);
        if (tr) {
          translations[locale] = {
            title: tr.title,
            note: tr.note,
            description: tr.description,
            material: tr.material,
            highlights: tr.highlights,
            seoTitle: tr.seoTitle,
            seoDescription: tr.seoDescription,
          };
        }
      }
      return {
        slug: row.slug,
        categoryId: row.categoryId,
        isNew: row.isNew,
        noindex: row.noindex,
        sortOrder: row.sortOrder,
        priceAmount: row.priceAmount === null ? null : Number(row.priceAmount),
        priceTiers: row.priceTiers,
        priceFrom: row.priceFrom,
        dimensions: row.dimensions,
        updatedAt: row.updatedAt,
        images: imageRows
          .filter((img) => img.productId === row.id)
          .map((img) => ({ file: img.file, width: img.width, height: img.height, alts: img.alts })),
        translations,
      };
    }),
  };
}
