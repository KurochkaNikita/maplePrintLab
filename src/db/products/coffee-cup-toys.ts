import type { ProductRecord } from "@/db/types";
import { pla } from "@/db/products/materials";

type Names = { en: string; fr: string };

/** All cup toys share price (category `priceTiers`), size, material and copy; only the name and photos differ. */
const size: ProductRecord["dimensions"] = { cm: [18, 18, 18], in: [7.1, 7.1, 7.1] };

function coffeeCupToy(slug: string, name: Names, images: ProductRecord["images"] = []): ProductRecord {
  return {
    slug,
    categoryId: "coffee-cup-toys",
    dimensions: size,
    images,
    material: pla,
    translations: {
      en: {
        title: name.en,
        note: "Themed 3D-printed toy for coffee cups.",
        description: `A small ${name.en} toy, 3D-printed in PLA. It attaches to a coffee cup with a mini double-sided sticker, so it is easy to add to any order. It is part of our themed cup-toy collection: a cheerful giveaway for cafés, events and brands, or a little surprise for your customers. Minimum order is 50 pieces, and the price per piece drops as the order grows.`,
        seo: {
          title: `${name.en} – Coffee Cup Toy`,
          description: `${name.en} coffee cup toy, 3D-printed in PLA, with a mini double-sided sticker. A giveaway for cafés and events. Minimum order 50 pcs.`,
        },
        imageAlts: images.map(() => `${name.en} coffee cup toy`),
      },
      fr: {
        title: name.fr,
        note: "Jouet thématique imprimé en 3D pour gobelets de café.",
        description: `Un petit jouet « ${name.fr} » imprimé en 3D en PLA. Il se fixe sur un gobelet de café avec un mini autocollant double face : facile à ajouter à n’importe quelle commande. Il fait partie de notre collection thématique de jouets pour gobelets : un cadeau amusant pour les cafés, les événements et les marques, ou une petite surprise pour vos clients. La commande minimum est de 50 pièces, et le prix à la pièce baisse à mesure que la commande grandit.`,
        seo: {
          title: `${name.fr} – Jouet gobelet de café`,
          description: `Jouet « ${name.fr} » pour gobelet de café, imprimé en 3D en PLA, avec mini autocollant. Cadeau pour cafés et événements. Minimum 50 pièces.`,
        },
        imageAlts: images.map(() => `Jouet « ${name.fr} » pour gobelet de café`),
      },
    },
  };
}

export const coffeeCupToys: ProductRecord[] = [
  coffeeCupToy("black-coffin", { en: "Black Coffin", fr: "Cercueil noir" }),
  coffeeCupToy("pink-coffin", { en: "Pink Coffin", fr: "Cercueil rose" }),
  coffeeCupToy("chick", { en: "Chick", fr: "Poussin" }),
  coffeeCupToy("skull", { en: "Skull", fr: "Crâne" }),
  coffeeCupToy("pink-pumpkin", { en: "Pink Pumpkin", fr: "Citrouille rose" }),
  coffeeCupToy("ghost", { en: "Ghost", fr: "Fantôme" }),
  coffeeCupToy("angry-pumpkin", { en: "Angry Pumpkin", fr: "Citrouille fâchée" }),
  coffeeCupToy("cat-pumpkin", { en: "Cat Pumpkin", fr: "Chat-citrouille" }),
];
