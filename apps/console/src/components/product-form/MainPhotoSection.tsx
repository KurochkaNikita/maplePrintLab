"use client";

import { useT } from "@/components/LocaleProvider";
import PhotoAddCard from "@/components/PhotoAddCard";
import PhotoSection from "@/components/PhotoSection";
import { useProductFormContext } from "@/hooks/useProductFormContext";
import type { ProductPhotos } from "@/hooks/useProductPhotos";
import { fieldId } from "@/lib/products/types";
import ProductPhotoCard from "./ProductPhotoCard";
import { errorText } from "./shared";

/** The required main photo: the add card until there is one, then its card. */
export function MainPhotoSection({ photos }: { photos: ProductPhotos }) {
  const { errors } = useProductFormContext();
  const dict = useT();
  const t = dict.pages.products.form.images;

  return (
    <PhotoSection headingId="pf-photos-main-heading" title={t.main} required hint={t.mainHint}>
      <ul className="grid gap-6">
        {photos.photos.length > 0 ? (
          <ProductPhotoCard index={0} title={t.preview} photos={photos} />
        ) : (
          <PhotoAddCard
            id={fieldId("photos")}
            required
            title={t.main}
            hint={t.mainHint}
            label={t.choose}
            busy={photos.busy}
            error={errorText(errors, "photos", dict)}
            onPick={() => photos.pick(null)}
          />
        )}
      </ul>
    </PhotoSection>
  );
}

export default MainPhotoSection;
