"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useT } from "@/components/LocaleProvider";
import { useCategoryFormContext } from "@/hooks/useCategoryFormContext";
import { photoVariantUrl } from "@/lib/products/photos";
import { uploadPhoto, type UploadPhotoFailure } from "@/lib/products/upload-photo";
import { MAX_PHOTO_BYTES, PHOTO_TYPES, type PhotoValues, type ProductLocale } from "@/lib/products/types";

const isAbsolute = (ref: string) => /^https?:\/\//.test(ref);

/** Behaviour of the cover section: picking a file, cropping it, uploading, and editing the alt texts. */
export function useCategoryCover() {
  const { values, errors, change } = useCategoryFormContext();
  const t = useT().pages.products.form.images;

  const [pending, setPending] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [pickError, setPickError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  // The upload outlives the render that started it: build the result from the latest values.
  const latest = useRef(values);
  latest.current = values;

  const cover = values.cover;
  const coverErrorKeys = () => Object.keys(errors).filter((key) => key.startsWith("cover."));

  const failureMessage: Record<UploadPhotoFailure, string> = {
    ratio: t.errors.ratio,
    tooSmall: t.errors.small,
    unreadable: t.errors.read,
    tooLarge: t.errors.size,
    failed: t.errors.upload,
  };

  const pick = () => {
    fileInput.current?.click();
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // the same file can be picked again
    if (!file) return;

    setPickError(null);
    if (!PHOTO_TYPES.includes(file.type)) return setPickError(t.errors.type);
    if (file.size > MAX_PHOTO_BYTES) return setPickError(t.errors.size);
    setDialogError(null);
    setPending(file);
  };

  /** Uploads the cropped image and makes it the cover, keeping the alt texts of the one it replaces. */
  const confirmCrop = async (cropped: Blob) => {
    if (!pending) return;
    setBusy(true);
    setDialogError(null);

    const result = await uploadPhoto(cropped);
    if (!result.ok) {
      setDialogError(failureMessage[result.reason]);
      setBusy(false);
      return;
    }

    const photo: PhotoValues = {
      url: result.url,
      width: result.width,
      height: result.height,
      alts: latest.current.cover?.alts ?? { en: "", fr: "" },
    };
    change({ ...latest.current, cover: photo }, ...coverErrorKeys());
    setPending(null);
    setBusy(false);
  };

  const remove = () => {
    change({ ...values, cover: null }, ...coverErrorKeys());
  };

  const setAlt = (locale: ProductLocale, value: string) => {
    if (!cover) return;
    change({ ...values, cover: { ...cover, alts: { ...cover.alts, [locale]: value } } }, `cover.alts.${locale}`);
  };

  const previewSrc = (ref: string) => (isAbsolute(ref) ? photoVariantUrl(ref, 800) : null);

  return {
    cover,
    pending,
    busy,
    dialogError,
    pickError,
    fileInput,
    pick,
    onFileInputChange,
    confirmCrop,
    cancelCrop: () => setPending(null),
    remove,
    setAlt,
    previewSrc,
  };
}
