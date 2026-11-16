import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, matchOrigin } from "@/lib/order-requests/cors";
import { handleOrderRequest } from "@/lib/order-requests/handle";

// PUBLIC route on purpose: the one exception to "every route handler calls requireAdmin()".
// The visitors of the storefront are anonymous, so there is no session to check. It is protected by other means:
// CORS limited to PUBLIC_SITE_ORIGIN, a honeypot, a minimum fill time, Cloudflare Turnstile and a per-IP rate
// limit; the product title and price come from the database; it only ever inserts one `order_requests` row.
// `proxy.ts` and Neon Auth do not cover /api/order-request (not in the matcher), so it stays reachable.

export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  const origin = matchOrigin(request.headers.get("origin"));
  return new NextResponse(null, { status: origin ? 204 : 403, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = matchOrigin(request.headers.get("origin"));
  if (!origin) return NextResponse.json({ ok: false, errors: { form: "badRequest" } }, { status: 403, headers: corsHeaders(null) });

  const { status, body } = await handleOrderRequest(request, request.nextUrl.origin);
  return NextResponse.json(body, { status, headers: corsHeaders(origin) });
}
