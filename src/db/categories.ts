import type { CategoryRecord } from "./types";

/**
 * Categories. Products point here via `categoryId`; a category's product list
 * is derived, never duplicated. `id` is the URL slug (/en/category/<id>/).
 */
export const categories: CategoryRecord[] = [
  {
    id: "layered-art",
    translations: {
      en: {
        title: "Layered paintings",
        intro: "Mini wall art made of stacked layers, 25 × 25 × 5 cm (10 × 10 × 2 in). The layers add real depth and a 3D effect.",
        seo: {
          title: "Mini layered paintings, 25×25 cm",
          description: "Small layered wall art, 25×25×5 cm (10×10×2 in). Stacked layers create real depth and a 3D effect. Discover the collection.",
          keywords: ["mini layered paintings", "layered wall art", "3D layered art Canada"],
        },
      },
      fr: {
        title: "Tableaux multicouches",
        intro: "Mini décor mural en couches superposées, 25 × 25 × 5 cm (10 × 10 × 2 po). Les couches créent une vraie profondeur et un effet 3D.",
        seo: {
          title: "Mini tableaux en couches, 25×25 cm",
          description: "Petits tableaux en couches superposées, 25×25×5 cm (10×10×2 po). Une vraie profondeur et un effet 3D. Découvrez la collection.",
          keywords: ["mini tableaux en couches", "tableau multicouche", "décoration murale 3D Canada"],
        },
      },
    },
  },
];
