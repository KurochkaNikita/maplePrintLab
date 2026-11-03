import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/** `fetchOptions` go to every query's `fetch` call (the storefront build passes Next.js cache hints). */
export function createDb(url = process.env.DATABASE_URL, fetchOptions?: RequestInit) {
  if (!url) throw new Error("DATABASE_URL is not set");
  return drizzle(neon(url, fetchOptions && { fetchOptions }), { schema });
}

export type Db = ReturnType<typeof createDb>;
