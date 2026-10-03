import type { Locale } from "@/lib/i18n";

/** One value per supported locale — adding a locale to `i18n.ts` makes every record that misses it a type error. */
export type Translations<T> = Record<Locale, T>;

/** Search-engine data for one page in one language. */
export type Seo = {
  /** <title> — the site name is appended by the layout's title template. */
  title: string;
  /** Meta description, aim for ≤ 155 characters. */
  description: string;
  keywords: string[];
};

/** Long-form copy under a category's product grid, plus its FAQ (also emitted as FAQPage JSON-LD). */
export type SeoBlock = {
  /** 2–3 sections, ~250–400 words in total; each heading renders as an <h2>. */
  sections: { heading: string; paragraphs: string[] }[];
  /** 4–5 questions; answers must be plain text (they go into JSON-LD verbatim). */
  faq: { q: string; a: string }[];
};

/** Volume price: `amount` CAD per piece for orders of `from`..`to` pieces (no `to` = open-ended). */
export type PriceTier = { from: number; to?: number; amount: number };

export type CategoryRecord = {
  /** URL slug: /<lang>/category/<id>/ */
  id: string;
  /** Every product in the category can be made in colours the customer picks; shown in each product's spec list. */
  customColours?: boolean;
  /** Volume pricing shared by every product in the category; shown as a table on the category and product pages. */
  priceTiers?: PriceTier[];
  translations: Translations<{
    title: string;
    intro: string;
    /** Short key condition (e.g. a minimum order), shown as a badge under the intro. */
    highlight?: string;
    seo: Seo;
    seoBlock?: SeoBlock;
  }>;
};

/** A product photo in `public/product/<slug>/<file>`; the first one is the main image. */
export type ProductImage = {
  file: string;
  width: number;
  height: number;
};

/** Width × height × depth, written out in both units so the copy can show round numbers (25 cm = 10 in). */
export type Dimensions = {
  cm: [width: number, height: number, depth: number];
  in: [width: number, height: number, depth: number];
};

/** One language's text for a product — lives in `products/<slug>/<lang>.ts`. */
export type ProductTranslation = {
  title: string;
  note: string;
  description: string;
  /** Alt text per photo, in the same order as `ProductRecord.images`. */
  imageAlts: string[];
  seo: Seo;
};

export type ProductRecord = {
  /** URL slug: /<lang>/product/<slug>/ */
  slug: string;
  /** -> categories.ts */
  categoryId: string;
  /** Shown in the homepage "latest work" section, in file order. */
  featured?: boolean;
  /** Omit when the category has `priceTiers` — the first tier is used. */
  price?: { amount: number; currency: "CAD"; from?: boolean };
  /** Every product states its size. */
  dimensions: Dimensions;
  images: ProductImage[];
  /** Every product states its material; reuse the constants in products/materials.ts. */
  material: Translations<string>;
  translations: Translations<ProductTranslation>;
};
