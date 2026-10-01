import type { CategoryRecord } from "./types";

/**
 * Categories. Products point here via `categoryId`; a category's product list
 * is derived, never duplicated. `id` is the URL slug (/en/category/<id>/).
 */
export const categories: CategoryRecord[] = [
  {
    id: "toys",
    translations: {
      en: {
        title: "Toys & collectibles",
        intro: "Durable models for play and display — with thoughtful finishing.",
        seo: {
          title: "Toys & collectibles",
          description: "Durable models for play and display — with thoughtful finishing.",
          keywords: ["toys & collectibles", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Jouets et objets de collection",
        intro: "Modèles durables pour jouer et exposer — avec une finition soignée.",
        seo: {
          title: "Jouets et objets de collection",
          description: "Modèles durables pour jouer et exposer — avec une finition soignée.",
          keywords: ["jouets et objets de collection", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    id: "decor",
    translations: {
      en: {
        title: "Home décor",
        intro: "Shapes that aren't in the store — matched to a specific interior.",
        seo: {
          title: "Home décor",
          description: "Shapes that aren't in the store — matched to a specific interior.",
          keywords: ["home décor", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Déco pour la maison",
        intro: "Des formes absentes des magasins — adaptées à un intérieur précis.",
        seo: {
          title: "Déco pour la maison",
          description: "Des formes absentes des magasins — adaptées à un intérieur précis.",
          keywords: ["déco pour la maison", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    id: "custom",
    translations: {
      en: {
        title: "Custom",
        intro: "Printed from your file, or geometry reworked until it's printable.",
        seo: {
          title: "Custom",
          description: "Printed from your file, or geometry reworked until it's printable.",
          keywords: ["custom", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Sur mesure",
        intro: "Imprimé à partir de votre fichier, ou géométrie retravaillée jusqu’à être imprimable.",
        seo: {
          title: "Sur mesure",
          description: "Imprimé à partir de votre fichier, ou géométrie retravaillée jusqu’à être imprimable.",
          keywords: ["sur mesure", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    id: "layered-art",
    translations: {
      en: {
        title: "Layered paintings",
        intro: "Multi-layer wall art: stacked cut-outs that cast real shadows.",
        seo: {
          title: "Layered paintings",
          description: "Multi-layer wall art: stacked cut-outs that cast real shadows.",
          keywords: ["layered paintings", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Tableaux multicouches",
        intro: "Décor mural en couches superposées qui projettent de vraies ombres.",
        seo: {
          title: "Tableaux multicouches",
          description: "Décor mural en couches superposées qui projettent de vraies ombres.",
          keywords: ["tableaux multicouches", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    id: "cup-toys",
    translations: {
      en: {
        title: "Coffee cup toys",
        intro: "Small characters that sit on the rim of your cup.",
        seo: {
          title: "Coffee cup toys",
          description: "Small characters that sit on the rim of your cup.",
          keywords: ["coffee cup toys", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Figurines pour tasse",
        intro: "De petits personnages qui s’installent sur le bord de votre tasse.",
        seo: {
          title: "Figurines pour tasse",
          description: "De petits personnages qui s’installent sur le bord de votre tasse.",
          keywords: ["figurines pour tasse", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
];
