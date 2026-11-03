"use client";

import { createContext, useContext } from "react";
import type { ProductListItem } from "@maple-print-lab/db";
import type { useCategoryForm, CategoryFormTarget } from "./useCategoryForm";
import type { CategoryFormValues } from "@/lib/categories/types";

export type CategoryFormProps = CategoryFormTarget & {
  initialValues: CategoryFormValues;
  /** The fallback category: its slug is fixed. */
  isDefault?: boolean;
  /** Products in the category, for the read-only Products tab (edit only). */
  products?: ProductListItem[];
  /** Origin of the public site, for thumbnails of photos imported from it. */
  siteUrl?: string;
  /** The page was reached right after creating the category. */
  justCreated?: boolean;
};

/** The form's state and actions (`useCategoryForm`) plus what the tabs need to know about the page. */
export type CategoryFormContextValue = ReturnType<typeof useCategoryForm> & {
  isEdit: boolean;
  isDefault: boolean;
  products: ProductListItem[];
  siteUrl?: string;
};

export const CategoryFormContext = createContext<CategoryFormContextValue | null>(null);

/** Everything the category form's tabs and fields share, so it is not passed down prop by prop. */
export function useCategoryFormContext(): CategoryFormContextValue {
  const value = useContext(CategoryFormContext);
  if (!value) throw new Error("useCategoryFormContext must be used inside <CategoryFormProvider>");
  return value;
}
