import "server-only";
import {
  countRequestsSince,
  createDb,
  createOrderRequest,
  findRequestableProducts,
  validateOrderRequest,
  type OrderRequestErrorCode,
  type OrderRequestErrors,
  type OrderRequestItemValue,
} from "@maple-print-lab/db";
import { siteUrl } from "@/lib/site-url";
import { clientIp, hashIp } from "./ip";
import { notifyOrderRequest } from "./notify";
import { verifyTurnstile } from "./turnstile";

/** A form submitted faster than this was not filled in by a person. */
export const MIN_FILL_MS = 2000;
export const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };
const MAX_BODY_CHARS = 20_000;

export type OrderRequestResponse = {
  status: number;
  body: { ok: true } | { ok: false; errors: OrderRequestErrors; /** Slugs that are no longer sold, so the page can mark those lines. */ unknownSlugs?: string[] };
};

const fail = (status: number, key: keyof OrderRequestErrors, code: OrderRequestErrorCode): OrderRequestResponse => ({
  status,
  body: { ok: false, errors: { [key]: code } },
});

const asString = (value: unknown) => (typeof value === "string" ? value : "");

/** Anything that is not a list of `{slug, quantity}` becomes an empty or invalid line, which validation then rejects. */
const asItems = (value: unknown): OrderRequestItemValue[] =>
  Array.isArray(value)
    ? value.map((item) => ({
        slug: item && typeof item === "object" ? asString((item as Record<string, unknown>).slug) : "",
        quantity: item && typeof item === "object" ? Number((item as Record<string, unknown>).quantity) : NaN,
      }))
    : [];

/** Everything the public endpoint does after CORS: spam checks, validation, saving, notification. */
export async function handleOrderRequest(request: Request, adminOrigin: string): Promise<OrderRequestResponse> {
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return fail(413, "form", "badRequest");
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    data = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "form", "badRequest");
  }

  // Honeypot: a bot fills the hidden field. Answer success so it learns nothing, and do nothing.
  if (asString(data.website).trim() !== "") return { status: 200, body: { ok: true } };

  const startedAt = typeof data.startedAt === "number" ? data.startedAt : NaN;
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) return fail(400, "form", "tooFast");

  const checked = validateOrderRequest({
    firstName: asString(data.firstName),
    lastName: asString(data.lastName),
    email: asString(data.email),
    message: asString(data.message),
    items: asItems(data.items),
    locale: asString(data.locale),
  });
  if ("errors" in checked) return { status: 400, body: { ok: false, errors: checked.errors } };

  const salt = process.env.IP_HASH_SALT || (process.env.NODE_ENV !== "production" ? "dev-salt" : "");
  if (!salt) {
    console.error("order-request: IP_HASH_SALT is not set");
    return fail(500, "form", "server");
  }
  const ip = clientIp(request.headers);
  if (!(await verifyTurnstile(asString(data.turnstileToken), ip))) return fail(400, "form", "captcha");

  try {
    const db = createDb();
    const ipHash = hashIp(ip, salt);
    if ((await countRequestsSince(db, ipHash, new Date(Date.now() - RATE_LIMIT.windowMs))) >= RATE_LIMIT.max) {
      return fail(429, "form", "rateLimited");
    }

    // Titles and prices come from the catalogue, not from the browser.
    const products = await findRequestableProducts(db, checked.input.items.map((item) => item.slug), checked.input.locale);
    const items = checked.input.items.flatMap((item) => {
      const product = products.find((p) => p.slug === item.slug);
      return product ? [{ ...product, quantity: item.quantity }] : [];
    });
    if (items.length < checked.input.items.length) {
      const unknownSlugs = checked.input.items.filter((item) => !products.some((p) => p.slug === item.slug)).map((item) => item.slug);
      return { status: 400, body: { ok: false, errors: { items: "unknownProduct" }, unknownSlugs } };
    }

    const saved = await createOrderRequest(db, { ...checked.input, items, ipHash });

    // The request is saved; a failed mail must not turn the customer's success into an error.
    await notifyOrderRequest({
      ...checked.input,
      items: items.map((item) => ({ productSlug: item.slug, productTitle: item.title, productPrice: item.price, quantity: item.quantity })),
      createdAt: saved.createdAt,
      siteUrl,
      adminUrl: `${adminOrigin}/requests/${saved.id}`,
    });
    return { status: 200, body: { ok: true } };
  } catch (e) {
    console.error("order-request: saving failed", e);
    return fail(500, "form", "server");
  }
}
