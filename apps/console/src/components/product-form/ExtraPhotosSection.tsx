"use client";

import { useT } from "@/components/LocaleProvider";
import PhotoAddCard from "@/components/PhotoAddCard";
import PhotoSection from "@/components/PhotoSection";
import type { ProductPhotos } from "@/hooks/useProductPhotos";
import { format } from "@/lib/i18n";
import { MAX_PHOTOS } from "@/lib/products/types";
import ProductPhotoCard from "./ProductPhotoCard";

/** Up to three optional photos after the main one; locked until the main photo exists. */
export function ExtraPhotosSection({ photos }: { photos: ProductPhotos }) {
  const t = useT().pages.products.form.images;
  const hasMain = photos.photos.length > 0;
  const extraCount = Math.max(photos.photos.length - 1, 0);

  return (
    <PhotoSection headingId="pf-photos-extra-heading" title={t.extras} hint={hasMain ? t.extrasHint : t.extrasLocked}>
      {hasMain && (
        <ul className="grid gap-6">
          {photos.photos.slice(1).map((photo, i) => (
            <ProductPhotoCard
              key={photo.url + (i + 1)}
              index={i + 1}
              title={format(t.extra, { n: i + 1 })}
              photos={photos}
            />
          ))}
          {photos.photos.length < MAX_PHOTOS && (
            <PhotoAddCard
              title={format(t.extra, { n: extraCount + 1 })}
              hint={t.extrasHint}
              label={t.choose}
              busy={photos.busy}
              onPick={() => photos.pick(null)}
            />
          )}
        </ul>
      )}
    </PhotoSection>
  );
}

export default ExtraPhotosSection;
