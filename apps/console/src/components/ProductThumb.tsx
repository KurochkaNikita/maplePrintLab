"use client";

import { useState } from "react";
import ImageIcon from "@/icons/image.svg";

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
        <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
      )}
    </span>
  );
}

export default ProductThumb;
