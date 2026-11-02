"use client";

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { format } from "@/lib/i18n";
import { PRODUCT_LOCALES, type PhotoValues, type ProductLocale } from "@/lib/products/types";

export interface PhotoCardLabels {
  replace: string;
  remove: string;
  /** Size line, with `{width}` and `{height}`. */
  size: string;
  /** Alt field label, with `{lang}`. */
  alt: string;
  altHint: string;
  /** Shown instead of the picture when it has no URL to load from. */
  legacy: string;
}

export interface PhotoCardProps {
  title: string;
  photo: PhotoValues;
  /** URL of the picture to show, or null for the `legacy` text. */
  src: string | null;
  /** An upload is running: actions are disabled. */
  busy: boolean;
  labels: PhotoCardLabels;
  /** Prefix of the element ids: `<idPrefix>-url` is the Replace button, `<idPrefix>-alts-<locale>` the alt fields (error focus targets). */
  idPrefix: string;
  /** Problem with the picture itself (e.g. an unusable file). */
  urlError?: string;
  /** Problem with each language's alt text. */
  altErrors: Partial<Record<ProductLocale, string>>;
  onReplace: () => void;
  onRemove: () => void;
  onAltChange: (locale: ProductLocale, value: string) => void;
}

/** One uploaded photo: clickable preview, its actions, and the alt text for every language. Renders an `<li>`. */
export function PhotoCard({
  title,
  photo,
  src,
  busy,
  labels,
  idPrefix,
  urlError,
  altErrors,
  onReplace,
  onRemove,
  onAltChange,
}: PhotoCardProps) {
  return (
    <li className="grid gap-x-6 gap-y-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <h3 className="font-display text-base font-semibold text-charcoal md:col-span-2">{title}</h3>

      {/* Photo and its actions; the alt texts sit beside them when there is room, below otherwise. */}
      <div className="space-y-3">
        {/* Same as "Replace" (which stays for keyboard and screen reader users), hence out of the tab order. */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          disabled={busy}
          onClick={onReplace}
          className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-xl border border-line bg-filament disabled:cursor-not-allowed"
        >
          {src ? (
            // Decorative: the alt text is edited beside it.
            // eslint-disable-next-line @next/next/no-img-element -- remote Blob photo
            <img src={src} alt="" width={photo.width} height={photo.height} className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center px-6 text-center text-sm text-ink">
              {labels.legacy}
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-charcoal/55 font-mono text-xs font-medium uppercase tracking-wider text-filament opacity-0 transition-opacity group-hover:opacity-100">
            {labels.replace}
          </span>
        </button>
        <p className="text-sm text-ink">{format(labels.size, { width: photo.width, height: photo.height })}</p>
        {urlError && <p className="text-sm font-medium text-amber-deep">{urlError}</p>}

        <div className="flex flex-wrap gap-2">
          <Button id={`${idPrefix}-url`} variant="secondary" size="sm" disabled={busy} onClick={onReplace}>
            {labels.replace}
          </Button>
          <Button variant="ghost" size="sm" disabled={busy} onClick={onRemove}>
            {labels.remove}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {PRODUCT_LOCALES.map((locale) => (
          <InputField
            key={locale}
            id={`${idPrefix}-alts-${locale}`}
            label={format(labels.alt, { lang: locale.toUpperCase() })}
            required
            tip={labels.altHint}
            error={altErrors[locale]}
            lang={locale}
            value={photo.alts[locale]}
            onChange={(value) => onAltChange(locale, value)}
          />
        ))}
      </div>
    </li>
  );
}

export default PhotoCard;
