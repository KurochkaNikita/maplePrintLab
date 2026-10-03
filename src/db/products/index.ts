import type { ProductRecord } from "@/db/types";
import { coffeeCupToys } from "@/db/products/coffee-cup-toys";
import { coolCatGlasses } from "@/db/products/cool-cat-glasses";
import { halloweenPumpkinGhostCat } from "@/db/products/halloween-pumpkin-ghost-cat";
import { happyHalloween } from "@/db/products/happy-halloween";
import { wideEyedCat } from "@/db/products/wide-eyed-cat";

/**
 * Products. One folder per product (`index.ts` = shared facts, `en.ts` / `fr.ts` = text).
 * Order here = display order. `categoryId` -> categories.ts.
 */
export const products: ProductRecord[] = [wideEyedCat, halloweenPumpkinGhostCat, happyHalloween, coolCatGlasses, ...coffeeCupToys];
