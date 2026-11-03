"use client";

import FormError from "@/components/FormError";
import HiddenFileInput from "@/components/HiddenFileInput";
import { useProductPhotos } from "@/hooks/useProductPhotos";
import { PHOTO_TYPES } from "@/lib/products/types";
import CropDialog from "./CropDialog";
import ExtraPhotosSection from "./ExtraPhotosSection";
import MainPhotoSection from "./MainPhotoSection";

/** The Photos tab: the main photo, the extra ones, and the crop dialog that opens when a file is picked. */
export function ImagesTab() {
  const photos = useProductPhotos();
  const { pending } = photos;

  return (
    <div className="space-y-10">
      <HiddenFileInput inputRef={photos.fileInput} accept={PHOTO_TYPES} onChange={photos.onFileInputChange} />
      <FormError id="pf-photos-pick-error" message={photos.pickError} />

      <MainPhotoSection photos={photos} />
      <ExtraPhotosSection photos={photos} />

      {pending && (
        <CropDialog
          key={pending.file.name + pending.file.size}
          file={pending.file}
          busy={photos.busy}
          error={photos.dialogError}
          onCancel={photos.cancelCrop}
          onConfirm={(cropped) => void photos.confirmCrop(cropped)}
        />
      )}
    </div>
  );
}

export default ImagesTab;
