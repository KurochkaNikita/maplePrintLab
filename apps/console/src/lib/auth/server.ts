import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});

export type AdminState = "admin" | "forbidden" | "anonymous";

/**
 * Signed in AND the one allowed account. Neon Auth is a public service anyone can
 * sign up to, so a valid session alone is NOT enough: always check the email.
 * Fails closed: with ADMIN_EMAIL unset nobody is admin.
 */
export async function getAdminState(): Promise<AdminState> {
  const { data: session } = await auth.getSession();
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) return "anonymous";
  const allowed = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return allowed && email === allowed ? "admin" : "forbidden";
}

/**
 * Call at the top of every Server Action and Route Handler that reads or writes data.
 * Layouts do not re-run on client-side navigation, so they cannot be the only guard.
 */
export async function requireAdmin(): Promise<void> {
  if ((await getAdminState()) !== "admin") {
    throw new Error("Unauthorized");
  }
}
