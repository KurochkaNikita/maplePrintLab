"use client";

import FormError from "@/components/FormError";
import HiddenFileInput from "@/components/HiddenFileInput";
import { useT } from "@/components/LocaleProvider";
import PhotoAddCard from "@/components/PhotoAddCard";
import PhotoCard from "@/components/PhotoCard";
import PhotoSection from "@/components/PhotoSection";
import CropDialog from "@/components/product-form/CropDialog";
import { useCategoryCover } from "@/hooks/useCategoryCover";
import { useCategoryFormContext } from "@/hooks/useCategoryFormContext";
import { fieldId, PRODUCT_LOCALES } from "@/lib/categories/types";
import { PHOTO_TYPES } from "@/lib/products/types";
import { errorText } from "./shared";

/** The optional cover photo: the add card until there is one, then its card; the crop dialog opens on pick. */
export function CoverSection() {
  const { errors } = useCategoryFormContext();
  const dict = useT();
  const t = dict.pages.categories.form.cover;
  const images = dict.pages.products.form.images;
  const cover = useCategoryCover();
  const err = (key: string) => errorText(errors, key, dict);

  return (
    <PhotoSection headingId="cf-cover-heading" title={t.title} hint={t.hint}>
      <HiddenFileInput inputRef={cover.fileInput} accept={PHOTO_TYPES} onChange={cover.onFileInputChange} />
      <FormError id="cf-cover-pick-error" message={cover.pickError} />

      <ul className="grid gap-6">
        {cover.cover ? (
          <PhotoCard
            title={t.title}
            photo={cover.cover}
            src={cover.previewSrc(cover.cover.url)}
            busy={cover.busy}
            labels={images}
            idPrefix={fieldId("cover")}
            urlError={err("cover.url")}
            altErrors={Object.fromEntries(PRODUCT_LOCALES.map((l) => [l, err(`cover.alts.${l}`)]))}
            onReplace={cover.pick}
            onRemove={cover.remove}
            onAltChange={cover.setAlt}
          />
        ) : (
          <PhotoAddCard title={t.title} hint={t.hint} label={images.choose} busy={cover.busy} onPick={cover.pick} />
        )}
      </ul>

      {cover.pending && (
        <CropDialog
          key={cover.pending.name + cover.pending.size}
          file={cover.pending}
          busy={cover.busy}
          error={cover.dialogError}
          onCancel={cover.cancelCrop}
          onConfirm={(cropped) => void cover.confirmCrop(cropped)}
        />
      )}
    </PhotoSection>
  );
}

export default CoverSection;
