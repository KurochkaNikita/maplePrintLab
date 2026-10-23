import { sql } from "drizzle-orm";
import type { Db } from "./client";

/**
 * Neon Auth owns `neon_auth.account`; the `isAdmin` column was added to it by hand,
 * so it is not in `schema.ts` and drizzle-kit must not manage it.
 * NULL (accounts created before the column existed) counts as not admin.
 */
export async function isAdminUser(db: Db, userId: string): Promise<boolean> {
  // noinspection SqlResolve: the IDE data source does not introspect the `neon_auth` schema.
  const { rows } = await db.execute(
    sql`select 1 from neon_auth.account where "userId" = ${userId} and "isAdmin" is true limit 1`,
  );
  return rows.length > 0;
}
