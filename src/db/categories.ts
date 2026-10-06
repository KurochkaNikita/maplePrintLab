import type { CategoryRecord } from "@/db/types";

/**
 * Categories. Products point here via `categoryId`; a category's product list
 * is derived, never duplicated. `id` is the URL slug (/en/category/<id>/).
 */
export const categories: CategoryRecord[] = [
  {
    id: "layered-art",
    customColours: true,
    translations: {
      en: {
        title: "Mini Layered Wall Art – 25×25 cm",
        intro: "Mini wall art made of stacked layers, 25 × 25 × 1.5 cm (10 × 10 × 0.6 in). Each piece is 3D-printed to order in Canada, with real depth and the colours of your choice.",
        seo: {
          title: "Mini Layered Wall Art 25×25 cm, 3D-Printed",
          description: "Mini layered wall art, 25×25×1.5 cm, 3D-printed to order in Canada. Real depth, colours of your choice. Great for shelves and gifts.",
        },
        seoBlock: {
          sections: [
            {
              heading: "What is a mini layered painting?",
              paragraphs: [
                "A layered painting is built from several layers stacked one in front of the other, instead of being painted on a single flat surface. Because every layer sits a little closer to you than the one behind it, the picture has real depth. Your eye reads it as three-dimensional, and it looks slightly different as you walk past it or as the light in the room changes.",
                "Our mini pieces are 25 × 25 × 1.5 cm (10 × 10 × 0.6 in). That is small enough for a shelf, a desk or a narrow stretch of wall, and the stacked layers are where the 3D effect comes from.",
              ],
            },
            {
              heading: "Where to put it",
              paragraphs: [
                "Each piece comes with a stand, so you can set it on a shelf, a desk or a windowsill without drilling anything. If you would rather see it on the wall, it can be hung there too.",
                "Since the effect depends on depth, a spot with soft light from the side usually shows it best. Because all the minis share the same square size, two or three of them also line up neatly side by side.",
              ],
            },
            {
              heading: "Choosing your piece",
              paragraphs: [
                "Start with the scene you would enjoy seeing every day, then think about the room it will live in. A calm landscape suits a bedroom or a reading corner; something bolder can wake up a plain hallway wall.",
                "Take a look at the photos of each piece, including the close-ups of the layers and the shots with a hand for scale, to get a feel for how big it really is. If you have a question about a particular piece, just write to us.",
              ],
            },
          ],
          faq: [
            {
              q: "What size are the mini layered paintings?",
              a: "Each piece is square: 25 × 25 cm (10 × 10 in) and 1.5 cm (0.6 in) deep.",
            },
            {
              q: "What is a layered painting?",
              a: "It is a picture made of several layers stacked in front of one another. The layers give it real depth, so it looks three-dimensional instead of flat.",
            },
            {
              q: "Can I stand it on a shelf or hang it on the wall?",
              a: "Both. Each piece has a stand so it can sit on a shelf or desk, and it can also be hung on a wall.",
            },
            {
              q: "Where does the 3D effect show best?",
              a: "In a place with soft light from the side. The layers cast subtle shading on each other, and the look changes a little as you move around the piece.",
            },
            {
              q: "What is PLA, and what does it mean for me?",
              a: "PLA (polylactic acid) is a plastic made from plant-based sources such as corn starch or sugar cane, not from petroleum. It is lightweight, holds bright colours well and has a smooth, matte look. One thing to know: it softens in high heat, so keep it away from radiators and out of a hot car.",
            },
          ],
        },
      },
      fr: {
        title: "Mini tableaux multicouches – 25×25 cm",
        intro: "Mini décor mural en couches superposées, 25 × 25 × 1,5 cm (10 × 10 × 0,6 po). Les couches créent une vraie profondeur et un effet 3D. Chaque pièce est imprimée en 3D sur commande au Canada, dans les couleurs de votre choix.",
        seo: {
          title: "Mini tableaux multicouches imprimés en 3D",
          description: "Mini tableaux multicouches 25×25×1,5 cm, imprimés en 3D sur commande au Canada. Vrai relief, couleurs au choix. Idéal en cadeau.",
        },
        seoBlock: {
          sections: [
            {
              heading: "Qu’est-ce qu’un mini tableau en couches ?",
              paragraphs: [
                "Un tableau multicouche est construit à partir de plusieurs couches placées les unes devant les autres, plutôt que peint sur une seule surface plane. Comme chaque couche est un peu plus proche de vous que celle qui se trouve derrière, l’image a une vraie profondeur. L’œil la perçoit en trois dimensions, et elle change légèrement quand vous passez devant ou quand la lumière de la pièce varie.",
                "Nos mini tableaux mesurent 25 × 25 × 1,5 cm (10 × 10 × 0,6 po). C’est assez petit pour une étagère, un bureau ou un petit pan de mur, et ce sont les couches superposées qui créent l’effet 3D.",
              ],
            },
            {
              heading: "Où l’installer",
              paragraphs: [
                "Chaque pièce est livrée avec un support : vous pouvez la poser sur une étagère, un bureau ou le rebord d’une fenêtre sans rien percer. Si vous préférez la voir au mur, elle peut aussi être accrochée.",
                "Comme l’effet repose sur la profondeur, un endroit éclairé par une lumière douce venant du côté la met généralement le mieux en valeur. Tous les minis ayant le même format carré, il est aussi facile d’en aligner deux ou trois côte à côte.",
              ],
            },
            {
              heading: "Choisir votre pièce",
              paragraphs: [
                "Commencez par la scène que vous aimeriez voir chaque jour, puis pensez à la pièce où elle ira. Un paysage paisible convient bien à une chambre ou à un coin lecture ; un motif plus audacieux peut animer un mur d’entrée un peu nu.",
                "Regardez les photos de chaque pièce, y compris les gros plans sur les couches et les images avec une main pour l’échelle, afin de bien saisir sa taille réelle. Pour toute question sur une pièce en particulier, écrivez-nous.",
              ],
            },
          ],
          faq: [
            {
              q: "Quelle est la taille des mini tableaux en couches ?",
              a: "Chaque pièce est carrée : 25 × 25 cm (10 × 10 po) et 1,5 cm (0,6 po) de profondeur.",
            },
            {
              q: "Qu’est-ce qu’un tableau en couches ?",
              a: "C’est une image composée de plusieurs couches placées les unes devant les autres. Elles lui donnent une vraie profondeur : elle paraît en trois dimensions plutôt que plate.",
            },
            {
              q: "Puis-je la poser sur une étagère ou l’accrocher au mur ?",
              a: "Les deux. Chaque pièce a un support pour se poser sur une étagère ou un bureau, et elle peut aussi être accrochée au mur.",
            },
            {
              q: "Où l’effet 3D ressort-il le mieux ?",
              a: "Dans un endroit avec une lumière douce venant du côté. Les couches projettent de subtiles ombres les unes sur les autres, et le rendu change un peu quand on se déplace autour de la pièce.",
            },
            {
              q: "Qu’est-ce que le PLA, et qu’est-ce que cela change pour moi ?",
              a: "Le PLA (acide polylactique) est un plastique fabriqué à partir de sources végétales comme l’amidon de maïs ou la canne à sucre, et non à partir de pétrole. Il est léger, garde bien les couleurs vives et offre un fini lisse et mat. Une précaution : il ramollit à la chaleur, alors gardez-le loin des radiateurs et ne le laissez pas dans une voiture chaude.",
            },
          ],
        },
      },
    },
  },
  {
    id: "coffee-cup-toys",
    priceTiers: [
      { from: 50, to: 149, amount: 1.2 },
      { from: 150, to: 349, amount: 1.1 },
      { from: 350, to: 499, amount: 1.0 },
      { from: 500, amount: 0.9 },
    ],
    translations: {
      en: {
        title: "Coffee cup toys",
        intro: "Small themed 3D-printed toys that attach to coffee cups with a mini double-sided sticker. A fun giveaway for cafés, events and brands, or a little surprise with an order.",
        highlight: "Minimum order: 50 pieces",
        seo: {
          title: "Coffee Cup Toys, 3D-Printed with Sticker",
          description: "Small themed 3D-printed toys for coffee cups, attached with a mini double-sided sticker. A giveaway for cafés and events. Minimum order 50 pcs.",
        },
      },
      fr: {
        title: "Jouets pour gobelets de café",
        intro: "Petits jouets thématiques imprimés en 3D qui se fixent sur les gobelets de café avec un mini autocollant double face. Un cadeau amusant pour les cafés, les événements et les marques, ou une petite surprise avec une commande.",
        highlight: "Commande minimum : 50 pièces",
        seo: {
          title: "Jouets pour gobelets de café imprimés 3D",
          description: "Jouets imprimés en 3D à fixer sur les gobelets de café avec un mini autocollant. Cadeau idéal pour cafés et événements. Minimum 50 pièces.",
        },
      },
    },
  },
];
