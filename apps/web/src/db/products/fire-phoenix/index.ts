import type { ProductRecord } from "@/db/types";
import { pla } from "@/db/products/materials";
import en from "./en";
import fr from "./fr";

/** Photos live in `public/product/fire-phoenix/`; `imageAlts` in en.ts / fr.ts follow this order. */
export const firePhoenix: ProductRecord = {
  slug: "fire-phoenix",
  categoryId: "layered-art",
  price: { amount: 20, currency: "CAD" },
  dimensions: { cm: [25, 25, 1.5], in: [10, 10, 0.6] },
  material: pla,
  images: [
    { file: "fire-phoenix-front.webp", width: 1920, height: 1440 },
    { file: "fire-phoenix-layers.webp", width: 320, height: 320 },
    { file: "fire-phoenix-stand.webp", width: 320, height: 320 },
  ],
  translations: { en, fr },
};
