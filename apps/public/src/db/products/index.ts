import type { ProductRecord } from "@/db/types";
import { blackCatPumpkin } from "@/db/products/black-cat-pumpkin";
import { coffeeCupToys } from "@/db/products/coffee-cup-toys";
import { coolDogGlasses } from "@/db/products/cool-dog-glasses";
import { coolCatGlasses } from "@/db/products/cool-cat-glasses";
import { halloweenPumpkinGhostCat } from "@/db/products/halloween-pumpkin-ghost-cat";
import { firePhoenix } from "@/db/products/fire-phoenix";
import { happyHalloween } from "@/db/products/happy-halloween";
import { lionDance } from "@/db/products/lion-dance";
import { wideEyedCat } from "@/db/products/wide-eyed-cat";

/**
 * Products. One folder per product (`index.ts` = shared facts, `en.ts` / `fr.ts` = text).
 * Order here = display order. `categoryId` -> categories.ts.
 */
export const products: ProductRecord[] = [wideEyedCat, halloweenPumpkinGhostCat, blackCatPumpkin, firePhoenix, lionDance, coolDogGlasses, happyHalloween, coolCatGlasses, ...coffeeCupToys];
