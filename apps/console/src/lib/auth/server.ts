import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});

export type AdminState = "admin" | "anonymous";

/**
 * Any valid Neon Auth session counts as admin: there is no email allowlist.
 * Access control therefore relies on registration being closed in Neon Auth
 * (the /api/auth route only blocks sign-up through our own domain).
 */
export async function getAdminState(): Promise<AdminState> {
  const { data: session } = await auth.getSession();
  return session?.user ? "admin" : "anonymous";
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
