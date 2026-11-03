"use client";

import { type CategoryFormProps } from "@/hooks/useCategoryFormContext";
import CategoryFormLayout from "./CategoryFormLayout";
import CategoryFormProvider from "./CategoryFormProvider";

export type { CategoryFormProps };

/** The category create/edit form: the provider owns the state, the layout renders it. */
export function CategoryForm(props: CategoryFormProps) {
  return (
    <CategoryFormProvider {...props}>
      <CategoryFormLayout />
    </CategoryFormProvider>
  );
}

export default CategoryForm;
