import { ORDER_REQUEST_LIMITS } from "@maple-print-lab/db/src/order-request-validation";

/** One piece in the visitor's request: which product and how many. Titles and prices are looked up when shown. */
export type CartLine = { slug: string; quantity: number };

export const MAX_QUANTITY = ORDER_REQUEST_LIMITS.quantity;
const MAX_LINES = ORDER_REQUEST_LIMITS.items;
const STORAGE_KEY = "mpl-request";

const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
// useSyncExternalStore needs the same array until something changes, so the parsed list is kept here.
let cache: CartLine[] | null = null;

/** Stored data is untrusted (older version, hand edits): keep only well-formed lines within the limits. */
function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    const lines: CartLine[] = [];
    for (const item of data) {
      const slug = typeof item?.slug === "string" ? item.slug : "";
      const quantity = Number(item?.quantity);
      if (!slug || !Number.isInteger(quantity) || quantity < 1 || lines.some((l) => l.slug === slug)) continue;
      lines.push({ slug, quantity: Math.min(quantity, MAX_QUANTITY) });
    }
    return lines.slice(0, MAX_LINES);
  } catch {
    return EMPTY;
  }
}

function read(): CartLine[] {
  try {
    return parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return EMPTY; // storage blocked (private mode, policy)
  }
}

const emit = () => listeners.forEach((listener) => listener());

function write(lines: CartLine[]) {
  cache = lines.length ? lines : EMPTY;
  try {
    if (lines.length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The list still works for this page view; it just will not survive a reload.
  }
  emit();
}

export const getSnapshot = (): CartLine[] => (cache ??= read());
export const getServerSnapshot = (): CartLine[] => EMPTY;

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab changed the list.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Adds one piece (or `by`). Returns the new quantity of that product, capped at the limit. */
export function addToCart(slug: string, by = 1): number {
  const lines = getSnapshot();
  const current = lines.find((l) => l.slug === slug);
  if (!current && lines.length >= MAX_LINES) return 0;
  const quantity = Math.min((current?.quantity ?? 0) + by, MAX_QUANTITY);
  write(current ? lines.map((l) => (l.slug === slug ? { slug, quantity } : l)) : [...lines, { slug, quantity }]);
  return quantity;
}

export function setCartQuantity(slug: string, quantity: number) {
  const next = Math.min(Math.max(Math.trunc(quantity), 1), MAX_QUANTITY);
  write(getSnapshot().map((l) => (l.slug === slug ? { slug, quantity: next } : l)));
}

export function removeFromCart(slug: string) {
  write(getSnapshot().filter((l) => l.slug !== slug));
}

export function clearCart() {
  write(EMPTY);
}
