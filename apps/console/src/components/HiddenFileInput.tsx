"use client";

import type { ChangeEventHandler, RefObject } from "react";

export interface HiddenFileInputProps {
  inputRef: RefObject<HTMLInputElement>;
  /** Allowed MIME types. */
  accept: readonly string[];
  onChange: ChangeEventHandler<HTMLInputElement>;
}

/** A file input that is never shown: buttons and images call `inputRef.current.click()` to open the picker. */
export function HiddenFileInput({ inputRef, accept, onChange }: HiddenFileInputProps) {
  return (
    <input
      ref={inputRef}
      type="file"
      accept={accept.join(",")}
      className="hidden"
      tabIndex={-1}
      aria-hidden="true"
      onChange={onChange}
    />
  );
}

export default HiddenFileInput;
