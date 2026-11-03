"use client";

import { useT } from "@/components/LocaleProvider";
import PhotoCard from "@/components/PhotoCard";
import { useProductFormContext } from "@/hooks/useProductFormContext";
import type { ProductPhotos } from "@/hooks/useProductPhotos";
import { fieldId, PRODUCT_LOCALES } from "@/lib/products/types";
import { errorText } from "./shared";

export interface ProductPhotoCardProps {
  index: number;
  title: string;
  photos: ProductPhotos;
}

/** `PhotoCard` for photo `index` of the product: its errors, preview and actions come from the form. */
export function ProductPhotoCard({ index, title, photos }: ProductPhotoCardProps) {
  const { errors } = useProductFormContext();
  const dict = useT();
  const err = (key: string) => errorText(errors, key, dict);
  const photo = photos.photos[index];

  return (
    <PhotoCard
      title={title}
      photo={photo}
      src={photos.previewSrc(photo.url)}
      busy={photos.busy}
      labels={dict.pages.products.form.images}
      idPrefix={fieldId(`photos.${index}`)}
      urlError={err(`photos.${index}.url`)}
      altErrors={Object.fromEntries(PRODUCT_LOCALES.map((l) => [l, err(`photos.${index}.alts.${l}`)]))}
      onReplace={() => photos.pick(index)}
      onRemove={() => photos.remove(index)}
      onAltChange={(locale, value) => photos.setAlt(index, locale, value)}
    />
  );
}

export default ProductPhotoCard;
