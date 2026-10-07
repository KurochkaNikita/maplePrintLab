import type { ProductRecord } from "@/db/types";
import { pla } from "@/db/products/materials";
import en from "./en";
import fr from "./fr";

/** Photos live in `public/product/cool-cat-glasses/`; `imageAlts` in en.ts / fr.ts follow this order. */
export const coolCatGlasses: ProductRecord = {
  slug: "cool-cat-glasses",
  categoryId: "layered-art",
  isNew: true,
  price: { amount: 20, currency: "CAD" },
  dimensions: { cm: [25, 25, 1.5], in: [10, 10, 0.6] },
  material: pla,
  images: [
    { file: "cool-cat-glasses-front.webp", width: 2000, height: 1500 },
    { file: "cool-cat-glasses-layers.webp", width: 320, height: 320 },
  ],
  translations: { en, fr },
};
