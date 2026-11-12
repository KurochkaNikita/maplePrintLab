"use client";

import type { ReactNode } from "react";
import { useCollectionForm } from "@/hooks/useCollectionForm";
import { CollectionFormContext, type CollectionFormProps } from "@/hooks/useCollectionFormContext";

/** Runs the form logic once and shares it with everything below. */
export function CollectionFormProvider({
  children,
  products = [],
  siteUrl,
  ...props
}: CollectionFormProps & { children: ReactNode }) {
  const form = useCollectionForm(props);

  return (
    <CollectionFormContext.Provider value={{ ...form, isEdit: props.mode === "edit", products, siteUrl }}>
      {children}
    </CollectionFormContext.Provider>
  );
}

export default CollectionFormProvider;
