"use client";

import { useState } from "react";
import ImageIcon from "@/icons/image.svg";

/** Decorative: the product title next to it is the accessible name. Falls back to a placeholder if the photo is missing or fails to load. */
export function ProductThumb({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="flex h-[72px] w-24 shrink-0 items-center justify-center overflow-hidden bg-filament text-charcoal/60">
      {src && !failed ? (
        <img
          src={src}
          alt=""
          width={96}
          height={72}
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
