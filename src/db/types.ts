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

export type CategoryRecord = {
  /** URL slug: /<lang>/category/<id>/ */
  id: string;
  translations: Translations<{
    title: string;
    intro: string;
    seo: Seo;
    seoBlock?: SeoBlock;
  }>;
};

/** A product photo in `public/product/<slug>/<file>`; the first one is the main image. */
export type ProductImage = {
  file: string;
  width: number;
  height: number;
  alt: Translations<string>;
};

/** Width × height × depth, written out in both units so the copy can show round numbers (25 cm = 10 in). */
export type Dimensions = {
  cm: [width: number, height: number, depth: number];
  in: [width: number, height: number, depth: number];
};

export type ProductRecord = {
  /** URL slug: /<lang>/product/<slug>/ */
  slug: string;
  /** -> categories.ts */
  categoryId: string;
  /** Shown in the homepage "latest work" section, in file order. */
  featured?: boolean;
  price: { amount: number; currency: "CAD"; from?: boolean };
  /** Every product states its size. */
  dimensions: Dimensions;
  images: ProductImage[];
  translations: Translations<{
    title: string;
    note: string;
    description: string;
    /** Every product states its material, e.g. "PLA". */
    material: string;
    seo: Seo;
  }>;
};
