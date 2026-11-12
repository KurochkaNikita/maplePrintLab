"use client";

import { createContext, useContext } from "react";
import type { ProductListItem } from "@maple-print-lab/db";
import type { useCollectionForm, CollectionFormTarget } from "./useCollectionForm";
import type { CollectionFormValues } from "@/lib/collections/types";

export type CollectionFormProps = CollectionFormTarget & {
  initialValues: CollectionFormValues;
  /** Products in the collection, for the read-only Products tab (edit only). */
  products?: ProductListItem[];
  /** Origin of the public site, for thumbnails of photos imported from it. */
  siteUrl?: string;
  /** The page was reached right after creating the collection. */
  justCreated?: boolean;
};

/** The form's state and actions (`useCollectionForm`) plus what the tabs need to know about the page. */
export type CollectionFormContextValue = ReturnType<typeof useCollectionForm> & {
  isEdit: boolean;
  products: ProductListItem[];
  siteUrl?: string;
};

export const CollectionFormContext = createContext<CollectionFormContextValue | null>(null);

/** Everything the collection form's tabs and fields share, so it is not passed down prop by prop. */
export function useCollectionFormContext(): CollectionFormContextValue {
  const value = useContext(CollectionFormContext);
  if (!value) throw new Error("useCollectionFormContext must be used inside <CollectionFormProvider>");
  return value;
}
