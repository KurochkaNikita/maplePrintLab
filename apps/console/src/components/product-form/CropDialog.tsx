"use client";

import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import Button from "@/components/Button";
import FormError from "@/components/FormError";
import { useT } from "@/components/LocaleProvider";
import Modal from "@/components/Modal";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { format } from "@/lib/i18n";
import { cropToJpeg } from "@/lib/products/crop-image";
import { PHOTO_ASPECT, PHOTO_MAX_WIDTH, PHOTO_MIN_HEIGHT, PHOTO_MIN_WIDTH } from "@/lib/products/photos";

export interface CropDialogProps {
  file: File;
  /** Uploading the cropped image; the dialog stays open and shows `error` if it fails. */
  busy: boolean;
  error: string | null;
  onCancel: () => void;
  /** Receives the 4:3 crop, at most 1600 px wide. */
  onConfirm: (cropped: Blob) => void;
}

/** Crop with a fixed 4:3 frame; the image is cut in the browser, the server only resizes it. */
export function CropDialog({ file, busy, error, onCancel, onConfirm }: CropDialogProps) {
  const t = useT().pages.products.form.images;
  const src = useObjectUrl(file);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [cropError, setCropError] = useState<string | null>(null);

  // Below the minimum the largest version (1200×900) would be an upscale.
  const tooSmall = area !== null && Math.round(area.width) < PHOTO_MIN_WIDTH;
  const tooSmallMessage =
    tooSmall && area
      ? format(t.tooSmall, {
          w: PHOTO_MIN_WIDTH,
          h: PHOTO_MIN_HEIGHT,
          cw: Math.round(area.width),
          ch: Math.round(area.height),
        })
      : null;

  async function apply() {
    if (!src || !area || tooSmall) return;
    setCropError(null);
    try {
      onConfirm(await cropToJpeg(src, area, PHOTO_ASPECT, PHOTO_MAX_WIDTH));
    } catch {
      setCropError(t.errors.crop);
    }
  }

  return (
    <Modal title={t.cropTitle} description={t.cropHint} onClose={onCancel} closable={!busy}>
      <div className="relative h-72 overflow-hidden rounded-xl bg-charcoal sm:h-96">
        {src && (
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            minZoom={1}
            maxZoom={4}
            aspect={PHOTO_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setArea(pixels)}
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="crop-zoom" className="text-sm font-medium text-charcoal">
          {t.zoom}
        </label>
        <input
          id="crop-zoom"
          type="range"
          min={1}
          max={4}
          step={0.05}
          value={zoom}
          disabled={busy}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="h-11 flex-1 accent-amber-deep"
        />
      </div>

      <FormError id="crop-error" message={cropError ?? error ?? tooSmallMessage} />

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="ghost" disabled={busy} onClick={onCancel}>
          {t.cancel}
        </Button>
        <Button loading={busy} disabled={!area || tooSmall} onClick={apply}>
          {busy ? t.uploading : t.apply}
        </Button>
      </div>
    </Modal>
  );
}

export default CropDialog;
