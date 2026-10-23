import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";
import { createDb, isAdminUser } from "@maple-print-lab/db";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});

/** "forbidden": signed in, but `neon_auth.account.isAdmin` is not true. */
export type AdminState = "admin" | "forbidden" | "anonymous";

/**
 * A valid Neon Auth session is not enough: the user must also have
 * `isAdmin = true` on their `neon_auth.account` row, checked on every call
 * so revoking the flag takes effect immediately.
 */
export async function getAdminState(): Promise<AdminState> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return "anonymous";
  return (await isAdminUser(createDb(), session.user.id)) ? "admin" : "forbidden";
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
