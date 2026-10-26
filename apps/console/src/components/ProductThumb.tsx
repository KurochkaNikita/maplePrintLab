"use client";

import { useState } from "react";

/** Decorative: the product title next to it is the accessible name. Falls back to a placeholder if the photo is missing or fails to load. */
export function ProductThumb({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-filament text-charcoal/60">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote storefront photo, already pre-sized
        <img
          src={src}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
        </svg>
      )}
    </span>
  );
}

export default ProductThumb;
