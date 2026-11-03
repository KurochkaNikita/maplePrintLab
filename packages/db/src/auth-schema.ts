import { boolean, pgSchema, uuid } from "drizzle-orm/pg-core";

/**
 * Neon Auth owns the `neon_auth` schema. It is declared here only so queries are typed:
 * this file is not listed in drizzle.config.ts, so drizzle-kit never creates or alters it.
 * Only the columns we read are listed. `isAdmin` is not part of Neon Auth: it was added to the table
 * by hand (`alter table neon_auth.account add column "isAdmin" boolean default false`), so a new
 * Neon project needs that statement run once, and admins are set with
 * `update neon_auth.account set "isAdmin" = true where "userId" = '<user id>'`.
 * NULL counts as not admin.
 */
export const neonAuth = pgSchema("neon_auth");

export const authAccounts = neonAuth.table("account", {
  id: uuid("id").primaryKey(),
  userId: uuid("userId").notNull(),
  isAdmin: boolean("isAdmin").default(false),
});
