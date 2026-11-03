import { and, eq } from "drizzle-orm";
import type { Db } from "./client";
import { authAccounts } from "./auth-schema";

/** True when one of the user's Neon Auth accounts has `isAdmin` set (NULL counts as not admin). */
export async function isAdminUser(db: Db, userId: string): Promise<boolean> {
  const rows = await db
    .select({ id: authAccounts.id })
    .from(authAccounts)
    .where(and(eq(authAccounts.userId, userId), eq(authAccounts.isAdmin, true)))
    .limit(1);
  return rows.length > 0;
}
