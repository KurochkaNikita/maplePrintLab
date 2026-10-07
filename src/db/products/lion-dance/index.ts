import type { ProductRecord } from "@/db/types";
import { pla } from "@/db/products/materials";
import en from "./en";
import fr from "./fr";

/** Photos live in `public/product/lion-dance/`; `imageAlts` in en.ts / fr.ts follow this order. */
export const lionDance: ProductRecord = {
  slug: "lion-dance",
  categoryId: "layered-art",
  price: { amount: 20, currency: "CAD" },
  dimensions: { cm: [25, 25, 1.5], in: [10, 10, 0.6] },
  material: pla,
  images: [
    { file: "lion-dance-front.webp", width: 1920, height: 1440 },
    { file: "lion-dance-layers.webp", width: 320, height: 320 },
    { file: "lion-dance-studio.webp", width: 320, height: 320 },
  ],
  translations: { en, fr },
};
