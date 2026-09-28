import type { Tone } from "@/lib/tone";

export type ProductItem = {
  slug: string;
  title: string;
  material: string;
  note: string;
  tone: Tone;
  price: string;
  sizes: string[];
  description: string;
  imageCount: number;
};

export type ProductCategory = {
  id: string;
  title: string;
  intro: string;
  items: ProductItem[];
};

export type ProductCatalog = ProductCategory[];
