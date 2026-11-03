"use client";

import type { ReactNode } from "react";
import { useProductForm } from "@/hooks/useProductForm";
import { ProductFormContext, type ProductFormProps } from "@/hooks/useProductFormContext";

/** Runs the form logic once and shares it with everything below. */
export function ProductFormProvider({ children, ...props }: ProductFormProps & { children: ReactNode }) {
  const form = useProductForm(props);

  return (
    <ProductFormContext.Provider
      value={{
        ...form,
        categories: props.categories,
        collections: props.collections,
        photoBaseUrl: props.photoBaseUrl,
        isEdit: props.mode === "edit",
      }}
    >
      {children}
    </ProductFormContext.Provider>
  );
}

export default ProductFormProvider;
