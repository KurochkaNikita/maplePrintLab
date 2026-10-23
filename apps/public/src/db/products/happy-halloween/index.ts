import type { ProductRecord } from "@/db/types";
import { pla } from "@/db/products/materials";
import en from "./en";
import fr from "./fr";

/** Photos live in `public/product/happy-halloween/`; `imageAlts` in en.ts / fr.ts follow this order. */
export const happyHalloween: ProductRecord = {
  slug: "happy-halloween",
  categoryId: "layered-art",
  collectionIds: ["halloween"],
  price: { amount: 20, currency: "CAD" },
  dimensions: { cm: [25, 25, 1.5], in: [10, 10, 0.6] },
  material: pla,
  images: [{ file: "happy-halloween-front.webp", width: 1920, height: 1440 }],
  translations: { en, fr },
};
