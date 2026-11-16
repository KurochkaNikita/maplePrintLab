import type { Dictionary } from "@/lib/dictionaries/en";

export type OrderLabels = Dictionary["order"];

/** A piece the visitor can have in the request, already formatted for the page language. */
export type CartCatalogEntry = {
  slug: string;
  title: string;
  /** "$65 CAD", or "From $30 CAD" when the price depends on the order size. */
  price: string;
  image?: { src: string; width: number; height: number; alt: string };
};
