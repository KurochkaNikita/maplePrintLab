"use client";

import { type CollectionFormProps } from "@/hooks/useCollectionFormContext";
import CollectionFormLayout from "./CollectionFormLayout";
import CollectionFormProvider from "./CollectionFormProvider";

export type { CollectionFormProps };

/** The collection create/edit form: the provider owns the state, the layout renders it. */
export function CollectionForm(props: CollectionFormProps) {
  return (
    <CollectionFormProvider {...props}>
      <CollectionFormLayout />
    </CollectionFormProvider>
  );
}

export default CollectionForm;
