import type { ProductRecord } from "./types";

/**
 * Products. Shared facts (category, price, photos) live once at the
 * top of each record; only text is per-language. Order here = display order.
 * `categoryId` -> categories.ts.
 */
export const products: ProductRecord[] = [
  {
    slug: "wide-eyed-cat",
    categoryId: "layered-art",
    featured: true,
    price: { amount: 20, currency: "CAD" },
    dimensions: { cm: [25, 25, 1.5], in: [10, 10, 0.6] },
    images: [
      {
        file: "wide-eyed-cat-front.webp",
        width: 1920,
        height: 1440,
        alt: {
          en: "Wide-Eyed Cat layered art: colourful cats in a round window inside a black frame, standing on a small stand",
          fr: "Chat aux grands yeux, tableau en couches : chats colorés dans une fenêtre ronde, cadre noir, sur un petit support",
        },
      },
      {
        file: "wide-eyed-cat-layers.webp",
        width: 1918,
        height: 1684,
        alt: {
          en: "Exploded view of the Wide-Eyed Cat showing its stacked coloured layers",
          fr: "Vue éclatée du Chat aux grands yeux montrant ses couches colorées superposées",
        },
      },
      {
        file: "wide-eyed-cat-studio.webp",
        width: 2000,
        height: 1500,
        alt: {
          en: "Wide-Eyed Cat on its stand on a workshop desk, with figures on the shelves behind",
          fr: "Chat aux grands yeux sur son support, posé sur un bureau d’atelier avec des figurines en arrière-plan",
        },
      },
    ],
    translations: {
      en: {
        title: "Wide-Eyed Cat",
        note: "Layered cats in a black frame, with a stand.",
        description:
          "A crowd of colourful cats in a round window, each one on its own layer. Look closely: the eyes are set back, so they seem to follow you as you move left, right, up or down. The piece is 25 × 25 × 1.5 cm in a black frame, printed in PLA, and comes with a small stand for a desk or shelf. It also looks good in a children’s room or beside a figure collection, and makes a cheerful gift for cat lovers.",
        material: "PLA",
        seo: {
          title: "Wide-Eyed Cat – Mini Layered Art 25×25 cm",
          description: "Colourful layered cat art, 25×25×1.5 cm, in a black frame with a stand. The wide eyes seem to follow you. Printed in PLA.",
          keywords: ["wide-eyed cat", "layered cat art", "cat wall art Canada", "mini layered art"],
        },
      },
      fr: {
        title: "Chat aux grands yeux",
        note: "Chats en couches dans un cadre noir, avec support.",
        description:
          "Une joyeuse bande de chats colorés dans une fenêtre ronde, chacun sur sa propre couche. Regardez bien : les yeux sont en retrait, si bien qu’ils semblent vous suivre quand vous vous déplacez à gauche, à droite, en haut ou en bas. La pièce mesure 25 × 25 × 1,5 cm, dans un cadre noir, est imprimée en PLA et vient avec un petit support pour un bureau ou une étagère. Elle trouve aussi sa place dans une chambre d’enfant ou près d’une collection de figurines, et fait un cadeau plein de bonne humeur pour les amoureux des chats.",
        material: "PLA",
        seo: {
          title: "Chat aux grands yeux – Mini tableau 25×25",
          description: "Tableau en couches de chats colorés, 25×25×1,5 cm, cadre noir et support. Les grands yeux semblent vous suivre. Imprimé en PLA.",
          keywords: ["chat aux grands yeux", "tableau chat en couches", "décoration murale chat Canada", "mini tableau en couches"],
        },
      },
    },
  },
];
