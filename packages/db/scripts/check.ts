/** Connectivity + row-count check. Run: yarn workspace @maple-print-lab/db db:check */
import { count } from "drizzle-orm";
import { createDb } from "../src/client";
import * as t from "../src/schema";

try {
  process.loadEnvFile(new URL("../../../apps/admin/.env.local", import.meta.url));
} catch {}

const db = createDb();
const rows = {
  categories: t.categories,
  category_translations: t.categoryTranslations,
  collections: t.collections,
  products: t.products,
  product_translations: t.productTranslations,
  product_images: t.productImages,
  product_collections: t.productCollections,
  redirects: t.redirects,
};
for (const [name, table] of Object.entries(rows)) {
  const [r] = await db.select({ n: count() }).from(table);
  console.log(name.padEnd(24), r.n);
}
