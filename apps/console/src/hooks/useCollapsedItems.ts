"use client";

import { useState } from "react";
import type { FieldErrors } from "@/lib/finance/types";

const itemIndexes = (errors: FieldErrors) =>
  Object.keys(errors).flatMap((key) => {
    const match = /^items\.(\d+)\./.exec(key);
    return match ? [Number(match[1])] : [];
  });

/** Which order lines are folded to their header. A line that gets an error is opened so the field can be seen. */
export function useCollapsedItems(count: number, errors: FieldErrors) {
  // An order with several lines opens as a list of headers.
  const [collapsed, setCollapsed] = useState<ReadonlySet<number>>(
    () => new Set(count > 1 ? Array.from({ length: count }, (_, i) => i) : []),
  );
  const [seenErrors, setSeenErrors] = useState(errors);

  // Adjusted while rendering, so the line is open before focus moves to its first invalid field.
  if (errors !== seenErrors) {
    setSeenErrors(errors);
    const invalid = new Set(itemIndexes(errors));
    if ([...invalid].some((i) => collapsed.has(i))) setCollapsed(new Set([...collapsed].filter((i) => !invalid.has(i))));
  }

  const toggle = (index: number) => {
    const next = new Set(collapsed);
    if (!next.delete(index)) next.add(index);
    setCollapsed(next);
  };

  /** Folds the lines already there, so the new one (added at the end) is the only one open. */
  const collapseAll = () => setCollapsed(new Set(Array.from({ length: count }, (_, i) => i)));

  /** Keeps the state on the same lines after one is removed and the later ones shift up. */
  const forget = (index: number) =>
    setCollapsed(new Set([...collapsed].filter((i) => i !== index).map((i) => (i > index ? i - 1 : i))));

  return { isCollapsed: (index: number) => collapsed.has(index), toggle, collapseAll, forget };
}
