"use client";

import type { ReactNode } from "react";
import { useCategoryForm } from "@/hooks/useCategoryForm";
import { CategoryFormContext, type CategoryFormProps } from "@/hooks/useCategoryFormContext";

/** Runs the form logic once and shares it with everything below. */
export function CategoryFormProvider({ children, isDefault = false, products = [], siteUrl, ...props }: CategoryFormProps & { children: ReactNode }) {
  const form = useCategoryForm(props);

  return (
    <CategoryFormContext.Provider value={{ ...form, isEdit: props.mode === "edit", isDefault, products, siteUrl }}>
      {children}
    </CategoryFormContext.Provider>
  );
}

export default CategoryFormProvider;
