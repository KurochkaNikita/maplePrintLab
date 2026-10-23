import type { CollectionRecord } from "@/db/types";

/**
 * Collections: groups of products across categories (seasons, themes, gifts).
 * Products join one or more via `collectionIds`; the list is derived.
 * `id` is the URL slug (/en/collection/<id>/). Order here = display order.
 */
export const collections: CollectionRecord[] = [
  {
    id: "halloween",
    translations: {
      en: {
        title: "Halloween Collection",
        intro: "Pumpkins, ghosts and black cats: 3D-printed Halloween decor, made to order in Canada in the colours you choose.",
        seo: {
          title: "Halloween 3D-Printed Decor & Gifts",
          description: "Halloween decor 3D-printed to order in Canada: pumpkins, ghosts and black cats in layered wall art. Colours of your choice.",
        },
      },
      fr: {
        title: "Collection Halloween",
        intro: "Citrouilles, fantômes et chats noirs : un décor d’Halloween imprimé en 3D sur commande au Canada, dans les couleurs de votre choix.",
        seo: {
          title: "Décor d’Halloween imprimé en 3D",
          description: "Décor d’Halloween imprimé en 3D sur commande au Canada : citrouilles, fantômes et chats noirs en tableaux multicouches. Couleurs au choix.",
        },
      },
    },
  },
];
