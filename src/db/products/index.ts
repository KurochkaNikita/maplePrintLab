import type { ProductRecord } from "@/db/types";
import { halloweenPumpkinGhostCat } from "@/db/products/halloween-pumpkin-ghost-cat";
import { wideEyedCat } from "@/db/products/wide-eyed-cat";

/**
 * Products. One folder per product (`index.ts` = shared facts, `en.ts` / `fr.ts` = text).
 * Order here = display order. `categoryId` -> categories.ts.
 */
export const products: ProductRecord[] = [wideEyedCat, halloweenPumpkinGhostCat];
