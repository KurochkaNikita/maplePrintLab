"use client";

import { useEffect, useState } from "react";

/** A `blob:` URL for a file, revoked when the file changes or the component unmounts. Null until created. */
export function useObjectUrl(file: Blob): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}
