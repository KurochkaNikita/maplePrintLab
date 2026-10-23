import type { ProductRecord } from "@/db/types";
import { pla } from "@/db/products/materials";
import en from "./en";
import fr from "./fr";

/** Photos live in `public/product/black-cat-pumpkin/`; `imageAlts` in en.ts / fr.ts follow this order. */
export const blackCatPumpkin: ProductRecord = {
  slug: "black-cat-pumpkin",
  categoryId: "layered-art",
  collectionIds: ["halloween"],
  price: { amount: 20, currency: "CAD" },
  dimensions: { cm: [25, 25, 1.5], in: [10, 10, 0.6] },
  material: pla,
  images: [{ file: "black-cat-pumpkin-front.webp", width: 1000, height: 750 }],
  translations: { en, fr },
};
