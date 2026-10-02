import type { ProductRecord } from "./types";

/**
 * Products. Shared facts (category, price, photos) live once at the
 * top of each record; only text is per-language. Order here = display order.
 * `categoryId` -> categories.ts.
 */
export const products: ProductRecord[] = [
  {
    slug: "layered-mountains",
    categoryId: "layered-art",
    price: { amount: 85, currency: "CAD" },
    imageCount: 3,
    translations: {
      en: {
        title: "Layered mountains",
        note: "Five stacked layers, wall mount included.",
        description:
          "A mountain range built from five stacked layers. Each layer casts a soft shadow on the next, so the piece changes with the light.",
        sizes: ["30 × 40 cm", "5 layers, 3 cm deep"],
        seo: {
          title: "Layered mountains",
          description: "A mountain range built from five stacked layers. Each layer casts a soft shadow on the next, so the piece changes with the light.",
          keywords: ["layered mountains", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Montagnes en couches",
        note: "Cinq couches superposées, fixation incluse.",
        description:
          "Une chaîne de montagnes composée de cinq couches superposées. Chaque couche projette une ombre douce sur la suivante : la pièce change avec la lumière.",
        sizes: ["30 × 40 cm", "5 couches, 3 cm de profondeur"],
        seo: {
          title: "Montagnes en couches",
          description: "Une chaîne de montagnes composée de cinq couches superposées. Chaque couche projette une ombre douce sur la suivante : la pièce change avec la lumière.",
          keywords: ["montagnes en couches", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    slug: "layered-maple-leaf",
    categoryId: "layered-art",
    price: { amount: 95, currency: "CAD" },
    imageCount: 3,
    translations: {
      en: {
        title: "Layered maple leaf",
        note: "Seven layers in autumn colours.",
        description:
          "A maple leaf in seven graduated autumn tones, ready to hang with a keyhole mount on the back.",
        sizes: ["35 × 35 cm", "7 layers, 3.5 cm deep"],
        seo: {
          title: "Layered maple leaf",
          description: "A maple leaf in seven graduated autumn tones, ready to hang with a keyhole mount on the back.",
          keywords: ["layered maple leaf", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Feuille d’érable en couches",
        note: "Sept couches aux couleurs d’automne.",
        description:
          "Une feuille d’érable en sept teintes d’automne dégradées, prête à accrocher grâce à la fixation au dos.",
        sizes: ["35 × 35 cm", "7 couches, 3,5 cm de profondeur"],
        seo: {
          title: "Feuille d’érable en couches",
          description: "Une feuille d’érable en sept teintes d’automne dégradées, prête à accrocher grâce à la fixation au dos.",
          keywords: ["feuille d’érable en couches", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
];
