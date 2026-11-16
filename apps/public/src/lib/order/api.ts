import type { OrderRequestErrors, OrderRequestItemValue } from "@maple-print-lab/db/src/order-request-validation";

export type OrderApiPayload = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  items: OrderRequestItemValue[];
  locale: string;
  /** Honeypot: people leave it empty. */
  website: string;
  /** Timestamp of when the page was opened; the server rejects forms filled in under 2 s. */
  startedAt: number;
  turnstileToken: string;
};

export type OrderApiResult = { ok: true } | { ok: false; errors: OrderRequestErrors; /** Pieces the shop no longer sells. */ unknownSlugs: string[] };

/** Posts the request. A network failure or an unreadable answer becomes a general `server` error. */
export async function postOrderRequest(url: string, payload: OrderApiPayload): Promise<OrderApiResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { ok: boolean; errors?: OrderRequestErrors; unknownSlugs?: string[] };
    if (body.ok) return { ok: true };
    return {
      ok: false,
      errors: response.status === 429 ? { form: "rateLimited" } : body.errors ?? { form: "server" },
      unknownSlugs: body.unknownSlugs ?? [],
    };
  } catch {
    return { ok: false, errors: { form: "server" }, unknownSlugs: [] };
  }
}
