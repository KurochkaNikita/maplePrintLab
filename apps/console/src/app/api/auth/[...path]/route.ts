import { auth } from "@/lib/auth/server";

const handler = auth.handler();

type Ctx = { params: Promise<{ path: string[] }> };

/** Single-admin app: self-service registration through our domain is closed. */
async function guarded(
  method: keyof typeof handler,
  request: Request,
  ctx: Ctx,
): Promise<Response> {
  const { path } = await ctx.params;
  if (path[0] === "sign-up") {
    return Response.json({ error: "Registration is disabled" }, { status: 403 });
  }
  return handler[method](request, ctx);
}

export const GET = (r: Request, c: Ctx) => guarded("GET", r, c);
export const POST = (r: Request, c: Ctx) => guarded("POST", r, c);
export const PUT = (r: Request, c: Ctx) => guarded("PUT", r, c);
export const PATCH = (r: Request, c: Ctx) => guarded("PATCH", r, c);
export const DELETE = (r: Request, c: Ctx) => guarded("DELETE", r, c);
