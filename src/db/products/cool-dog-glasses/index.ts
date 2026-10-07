import type { ProductRecord } from "@/db/types";
import { pla } from "@/db/products/materials";
import en from "./en";
import fr from "./fr";

/** Photos live in `public/product/cool-dog-glasses/`; `imageAlts` in en.ts / fr.ts follow this order. */
export const coolDogGlasses: ProductRecord = {
  slug: "cool-dog-glasses",
  categoryId: "layered-art",
  isNew: true,
  price: { amount: 20, currency: "CAD" },
  dimensions: { cm: [25, 25, 1.5], in: [10, 10, 0.6] },
  material: pla,
  images: [
    { file: "cool-dog-glasses-front.webp", width: 1920, height: 1440 },
    { file: "cool-dog-glasses-layers.webp", width: 320, height: 320 },
  ],
  translations: { en, fr },
};
