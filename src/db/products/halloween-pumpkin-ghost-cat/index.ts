import type { ProductRecord } from "@/db/types";
import { pla } from "@/db/products/materials";
import en from "./en";
import fr from "./fr";

/** Photos live in `public/product/halloween-pumpkin-ghost-cat/`; `imageAlts` in en.ts / fr.ts follow this order. */
export const halloweenPumpkinGhostCat: ProductRecord = {
  slug: "halloween-pumpkin-ghost-cat",
  categoryId: "layered-art",
  collectionIds: ["halloween"],
  price: { amount: 20, currency: "CAD" },
  dimensions: { cm: [25, 25, 1.5], in: [10, 10, 0.6] },
  material: pla,
  images: [
    { file: "halloween-pumpkin-ghost-cat-front.webp", width: 1920, height: 1440 },
    { file: "halloween-pumpkin-ghost-cat-layers.webp", width: 320, height: 320 },
  ],
  translations: { en, fr },
};
