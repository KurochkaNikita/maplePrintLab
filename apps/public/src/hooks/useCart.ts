"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe, type CartLine } from "@/lib/cart/store";

/** The visitor's request list, kept in localStorage and shared by every component and tab. Empty during the server render. */
export function useCart(): { lines: CartLine[]; pieces: number } {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { lines, pieces: lines.reduce((sum, line) => sum + line.quantity, 0) };
}

const subscribeNothing = () => () => {};

/** False in the static HTML and during hydration, true afterwards: lets client-only UI avoid a mismatch. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNothing, () => true, () => false);
}
