"use client";

import { createContext, useContext } from "react";
import type { CategoryOption, CollectionOption } from "@maple-print-lab/db";
import type { ProductFormValues } from "@/lib/products/types";
import type { ProductFormTarget, useProductForm } from "./useProductForm";

export type ProductFormProps = ProductFormTarget & {
  initialValues: ProductFormValues;
  categories: CategoryOption[];
  collections: CollectionOption[];
  /** Base URL of the photos imported from the site, for previews: `<site>/product/<slug>/`. */
  photoBaseUrl?: string;
  /** The page was reached right after creating the product. */
  justCreated?: boolean;
};

/** The form's state and actions (`useProductForm`) plus what the tabs need to know about the page. */
export type ProductFormContextValue = ReturnType<typeof useProductForm> & {
  categories: CategoryOption[];
  collections: CollectionOption[];
  photoBaseUrl?: string;
  isEdit: boolean;
  /** The chosen category has volume pricing, so the product has no price of its own. */
  categoryHasPriceTiers: boolean;
};

export const ProductFormContext = createContext<ProductFormContextValue | null>(null);

/** Everything the product form's tabs and fields share, so it is not passed down prop by prop. */
export function useProductFormContext(): ProductFormContextValue {
  const value = useContext(ProductFormContext);
  if (!value) throw new Error("useProductFormContext must be used inside <ProductFormProvider>");
  return value;
}
