"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useT } from "@/components/LocaleProvider";
import { useProductFormContext } from "@/hooks/useProductFormContext";
import { photoVariantUrl } from "@/lib/products/photos";
import { uploadPhoto, type UploadPhotoFailure } from "@/lib/products/upload-photo";
import {
  MAX_PHOTO_BYTES,
  PHOTO_TYPES,
  type PhotoValues,
  type ProductLocale,
} from "@/lib/products/types";

const isAbsolute = (ref: string) => /^https?:\/\//.test(ref);

/**
 * Behaviour of the Photos tab: picking a file, cropping it, uploading, and editing the list
 * (replace, remove, alt texts). The photos themselves live in the form's values.
 */
export function useProductPhotos() {
  const { values, errors, change, photoBaseUrl } = useProductFormContext();
  const t = useT().pages.products.form.images;

  /** The file being cropped, and which photo it replaces (null = a new one). */
  const [pending, setPending] = useState<{ file: File; index: number | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [pickError, setPickError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  /** Which photo the open file picker is for; null = a new one. */
  const target = useRef<number | null>(null);
  // The upload outlives the render that started it: build the result from the latest values.
  const latest = useRef(values);
  latest.current = values;

  const photos = values.photos;
  const photoErrorKeys = () => Object.keys(errors).filter((key) => key === "photos" || key.startsWith("photos."));

  const failureMessage: Record<UploadPhotoFailure, string> = {
    ratio: t.errors.ratio,
    tooSmall: t.errors.small,
    unreadable: t.errors.read,
    tooLarge: t.errors.size,
    failed: t.errors.upload,
  };

  /** Opens the file picker for photo `index`, or for a new photo when null. */
  function pick(index: number | null) {
    target.current = index;
    fileInput.current?.click();
  }

  function onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // the same file can be picked again
    if (!file) return;

    setPickError(null);
    if (!PHOTO_TYPES.includes(file.type)) return setPickError(t.errors.type);
    if (file.size > MAX_PHOTO_BYTES) return setPickError(t.errors.size);
    setDialogError(null);
    setPending({ file, index: target.current });
  }

  /** Uploads the cropped image and puts it into the list: in place of the replaced photo, or at the end. */
  async function confirmCrop(cropped: Blob) {
    if (!pending) return;
    setBusy(true);
    setDialogError(null);

    const result = await uploadPhoto(cropped);
    if (!result.ok) {
      setDialogError(failureMessage[result.reason]);
      setBusy(false);
      return;
    }

    const current = latest.current.photos;
    const replaced = pending.index !== null ? current[pending.index] : undefined;
    const photo: PhotoValues = {
      url: result.url,
      width: result.width,
      height: result.height,
      alts: replaced?.alts ?? { en: "", fr: "" },
    };
    const next = replaced ? current.map((p, i) => (i === pending.index ? photo : p)) : [...current, photo];
    change({ ...latest.current, photos: next }, ...photoErrorKeys());
    setPending(null);
    setBusy(false);
  }

  function remove(index: number) {
    // Later photos move up, so the main photo is always the first one left.
    change({ ...values, photos: photos.filter((_, i) => i !== index) }, ...photoErrorKeys());
  }

  function setAlt(index: number, locale: ProductLocale, value: string) {
    const next = photos.map((p, i) => (i === index ? { ...p, alts: { ...p.alts, [locale]: value } } : p));
    change({ ...values, photos: next }, `photos.${index}.alts.${locale}`);
  }

  /** Uploaded photos come from Blob; imported ones are bare file names on the public site (null without its URL). */
  const previewSrc = (ref: string) =>
    isAbsolute(ref) ? photoVariantUrl(ref, 800) : photoBaseUrl ? `${photoBaseUrl}${ref}` : null;

  return {
    photos,
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

/** What `useProductPhotos` returns: handed to the parts of the Photos tab so they share one upload state. */
export type ProductPhotos = ReturnType<typeof useProductPhotos>;
