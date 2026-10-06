import type { ProductRecord } from "@/db/types";
import { pla } from "@/db/products/materials";
import en from "./en";
import fr from "./fr";

/** Photos live in `public/product/wide-eyed-cat/`; `imageAlts` in en.ts / fr.ts follow this order. */
export const wideEyedCat: ProductRecord = {
  slug: "wide-eyed-cat",
  categoryId: "layered-art",
  featured: true,
  price: { amount: 20, currency: "CAD" },
  dimensions: { cm: [25, 25, 1.5], in: [10, 10, 0.6] },
  material: pla,
  images: [
    { file: "wide-eyed-cat-front.webp", width: 1920, height: 1440 },
    { file: "wide-eyed-cat-layers.webp", width: 320, height: 320 },
    { file: "wide-eyed-cat-studio.webp", width: 320, height: 320 },
  ],
  translations: { en, fr },
};
