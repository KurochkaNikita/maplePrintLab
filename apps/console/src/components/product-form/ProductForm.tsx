"use client";

import { type ProductFormProps } from "@/hooks/useProductFormContext";
import ProductFormLayout from "./ProductFormLayout";
import ProductFormProvider from "./ProductFormProvider";

export type { ProductFormProps };

/** The product create/edit form: the provider owns the state, the layout renders it. */
export function ProductForm(props: ProductFormProps) {
  return (
    <ProductFormProvider {...props}>
      <ProductFormLayout />
    </ProductFormProvider>
  );
}

export default ProductForm;
