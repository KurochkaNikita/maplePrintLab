import type { ProductCatalog } from "./types";

const products: ProductCatalog = [
  {
    id: "toys",
    title: "Jouets et objets de collection",
    intro:
      "Modèles durables pour jouer et exposer — avec une finition soignée.",
    items: [
      {
        slug: "articulated-dragon",
        title: "Dragon articulé",
        material: "PLA",
        note: "Segments articulés, imprimé en place, sans support, 14 cm.",
        tone: "amber",
        price: "65 $ CA",
        sizes: ["14 cm de long", "Impression en une seule pièce, sans assemblage"],
        description:
          "Un dragon entièrement articulé imprimé en une seule pièce, sans support — chaque articulation bouge dès la sortie du plateau. PLA dans la couleur de votre choix, nettoyé à la main avant l’envoi.",
        imageCount: 3,
      },
      {
        slug: "granite-chess-set",
        title: "Jeu d’échecs « Granit »",
        material: "PLA mat",
        note: "Bases lestées, surface mate des couches.",
        tone: "charcoal",
        price: "180 $ CA",
        sizes: ["Plateau 40 × 40 cm", "Roi de 9,5 cm de haut"],
        description:
          "Un jeu complet de 32 pièces avec une finition mate mouchetée qui rappelle la pierre. Les bases sont lestées pour une bonne tenue sur le plateau.",
        imageCount: 4,
      },
      {
        slug: "mechanical-beetle",
        title: "Scarabée mécanique",
        material: "PETG",
        note: "Modèle cinétique, engrenages imprimés déjà assemblés.",
        tone: "teal",
        price: "40 $ CA",
        sizes: ["6 cm de long", "Pattes et engrenages imprimés déjà assemblés"],
        description:
          "Un scarabée cinétique dont les pattes et les engrenages internes s’impriment déjà assemblés — pas de colle, pas de petites pièces à perdre. Remontez le mécanisme et regardez-le marcher.",
        imageCount: 3,
      },
    ],
  },
  {
    id: "decor",
    title: "Déco pour la maison",
    intro:
      "Des formes absentes des magasins — adaptées à un intérieur précis.",
    items: [
      {
        slug: "faceted-vase",
        title: "Vase à facettes",
        material: "PETG",
        note: "Insert étanche amovible, 22 cm.",
        tone: "teal",
        price: "55 $ CA",
        sizes: ["22 cm de haut", "Reçoit un insert standard de 1 L"],
        description:
          "Un vase low-poly avec un insert étanche amovible, pour que la coque imprimée ne soit jamais en contact avec l’eau. Disponible dans toutes nos couleurs PETG standards.",
        imageCount: 3,
      },
      {
        slug: "spiral-planter",
        title: "Cache-pot « Spirale »",
        material: "PLA",
        note: "Soucoupe de drainage incluse, pour plantes grasses.",
        tone: "amber",
        price: "35 $ CA",
        sizes: ["12 cm de diamètre", "Soucoupe de drainage incluse"],
        description:
          "Un cache-pot à côtes en spirale dimensionné pour les plantes grasses et petites plantes d’intérieur, avec une soucoupe de drainage imprimée sur mesure.",
        imageCount: 2,
      },
      {
        slug: "wall-lamp",
        title: "Applique murale",
        material: "PLA translucide",
        note: "Diffuseur pour ampoule E14, lumière chaude à travers les couches.",
        tone: "charcoal",
        price: "85 $ CA",
        sizes: ["18 cm de diamètre", "Reçoit une ampoule E14 standard"],
        description:
          "Un diffuseur en PLA translucide qui laisse passer une lumière chaude à travers les lignes d’impression. Se fixe à plat contre le mur et reçoit une ampoule E14 standard.",
        imageCount: 4,
      },
    ],
  },
  {
    id: "custom",
    title: "Sur mesure",
    intro:
      "Imprimé à partir de votre fichier, ou géométrie retravaillée jusqu’à être imprimable.",
    items: [
      {
        slug: "headphone-stand",
        title: "Support pour casque",
        material: "PLA",
        note: "Pour un bord de bureau de 18 mm, sans perçage.",
        tone: "charcoal",
        price: "28 $ CA",
        sizes: ["Pour bureaux jusqu’à 18 mm d’épaisseur", "Serrage, sans perçage"],
        description:
          "Se fixe au bord du bureau sans perçage ni quincaillerie — juste un ajustement PLA précis, dimensionné pour un plateau de 18 mm.",
        imageCount: 2,
      },
      {
        slug: "coffee-grinder-part",
        title: "Pièce de moulin à café",
        material: "PETG",
        note: "Rétro-ingénierie à partir d’un original usé.",
        tone: "amber",
        price: "18 $ CA",
        sizes: ["Ajusté à votre modèle de moulin", "Envoyez l’original comme référence"],
        description:
          "Rétro-ingénierie à partir d’une pièce d’origine usée. Envoyez-nous le modèle de votre moulin (ou la pièce cassée) et nous ajusterons la forme avant l’impression.",
        imageCount: 2,
      },
      {
        slug: "pcb-enclosure",
        title: "Boîtier pour circuit imprimé",
        material: "PETG",
        note: "Découpes pour les connecteurs, encliquetage, sans vis.",
        tone: "teal",
        price: "À partir de 30 $ CA",
        sizes: ["Dimensionné pour votre carte", "Couvercle à encliquetage, sans vis"],
        description:
          "Un boîtier à encliquetage avec des découpes pour vos connecteurs — aucune vis nécessaire. Envoyez les dimensions de votre carte ou un fichier et nous ajusterons la coque.",
        imageCount: 3,
      },
    ],
  },
];

export default products;
