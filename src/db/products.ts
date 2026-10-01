import type { ProductRecord } from "./types";

/**
 * Products. Shared facts (category, price, photos) live once at the
 * top of each record; only text is per-language. Order here = display order.
 * `categoryId` -> categories.ts.
 */
export const products: ProductRecord[] = [
  {
    slug: "articulated-dragon",
    categoryId: "toys",
    featured: true,
    price: { amount: 65, currency: "CAD" },
    imageCount: 3,
    translations: {
      en: {
        title: "Articulated dragon",
        note: "Articulated segments, print-in-place, no supports, 14 cm.",
        description:
          "A fully articulated dragon printed in one piece with no supports — every joint moves right off the plate. PLA in a colour of your choice, hand-cleaned before it ships.",
        sizes: ["14 cm long", "Single-piece print, no assembly"],
        seo: {
          title: "Articulated dragon",
          description: "A fully articulated dragon printed in one piece with no supports — every joint moves right off the plate.",
          keywords: ["articulated dragon", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Dragon articulé",
        note: "Segments articulés, imprimé en place, sans support, 14 cm.",
        description:
          "Un dragon entièrement articulé imprimé en une seule pièce, sans support — chaque articulation bouge dès la sortie du plateau. PLA dans la couleur de votre choix, nettoyé à la main avant l’envoi.",
        sizes: ["14 cm de long", "Impression en une seule pièce, sans assemblage"],
        seo: {
          title: "Dragon articulé",
          description: "Un dragon entièrement articulé imprimé en une seule pièce, sans support — chaque articulation bouge dès la sortie du plateau.",
          keywords: ["dragon articulé", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    slug: "granite-chess-set",
    categoryId: "toys",
    price: { amount: 180, currency: "CAD" },
    imageCount: 4,
    translations: {
      en: {
        title: "“Granite” chess set",
        note: "Weighted bases, matte layer surface.",
        description:
          "A full 32-piece set with a mottled matte finish that reads like stone. Bases are weighted for a solid feel across the board.",
        sizes: ["Board 40 × 40 cm", "King height 9.5 cm"],
        seo: {
          title: "“Granite” chess set",
          description: "A full 32-piece set with a mottled matte finish that reads like stone. Bases are weighted for a solid feel across the board.",
          keywords: ["“granite” chess set", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Jeu d’échecs « Granit »",
        note: "Bases lestées, surface mate des couches.",
        description:
          "Un jeu complet de 32 pièces avec une finition mate mouchetée qui rappelle la pierre. Les bases sont lestées pour une bonne tenue sur le plateau.",
        sizes: ["Plateau 40 × 40 cm", "Roi de 9,5 cm de haut"],
        seo: {
          title: "Jeu d’échecs « Granit »",
          description: "Un jeu complet de 32 pièces avec une finition mate mouchetée qui rappelle la pierre. Les bases sont lestées pour une bonne tenue sur le plateau.",
          keywords: ["jeu d’échecs « granit »", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    slug: "mechanical-beetle",
    categoryId: "toys",
    price: { amount: 40, currency: "CAD" },
    imageCount: 3,
    translations: {
      en: {
        title: "Mechanical beetle",
        note: "Kinetic model, gears print pre-assembled.",
        description:
          "A kinetic beetle whose legs and internal gearing print already assembled — no glue, no small parts to lose. Wind the mechanism and watch it walk.",
        sizes: ["6 cm long", "Legs and gears print pre-assembled"],
        seo: {
          title: "Mechanical beetle",
          description: "A kinetic beetle whose legs and internal gearing print already assembled — no glue, no small parts to lose. Wind the mechanism and watch it walk.",
          keywords: ["mechanical beetle", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Scarabée mécanique",
        note: "Modèle cinétique, engrenages imprimés déjà assemblés.",
        description:
          "Un scarabée cinétique dont les pattes et les engrenages internes s’impriment déjà assemblés — pas de colle, pas de petites pièces à perdre. Remontez le mécanisme et regardez-le marcher.",
        sizes: ["6 cm de long", "Pattes et engrenages imprimés déjà assemblés"],
        seo: {
          title: "Scarabée mécanique",
          description: "Un scarabée cinétique dont les pattes et les engrenages internes s’impriment déjà assemblés — pas de colle, pas de petites pièces à perdre.",
          keywords: ["scarabée mécanique", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    slug: "faceted-vase",
    categoryId: "decor",
    featured: true,
    price: { amount: 55, currency: "CAD" },
    imageCount: 3,
    translations: {
      en: {
        title: "Faceted vase",
        note: "Removable waterproof insert, 22 cm.",
        description:
          "A low-poly vase with a removable, waterproof insert, so the printed shell never touches water directly. Available in any of our standard PETG colours.",
        sizes: ["22 cm tall", "Fits a standard 1 L insert"],
        seo: {
          title: "Faceted vase",
          description: "A low-poly vase with a removable, waterproof insert, so the printed shell never touches water directly. Available in any of our standard PETG colours.",
          keywords: ["faceted vase", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Vase à facettes",
        note: "Insert étanche amovible, 22 cm.",
        description:
          "Un vase low-poly avec un insert étanche amovible, pour que la coque imprimée ne soit jamais en contact avec l’eau. Disponible dans toutes nos couleurs PETG standards.",
        sizes: ["22 cm de haut", "Reçoit un insert standard de 1 L"],
        seo: {
          title: "Vase à facettes",
          description: "Un vase low-poly avec un insert étanche amovible, pour que la coque imprimée ne soit jamais en contact avec l’eau.",
          keywords: ["vase à facettes", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    slug: "spiral-planter",
    categoryId: "decor",
    price: { amount: 35, currency: "CAD" },
    imageCount: 2,
    translations: {
      en: {
        title: "“Spiral” planter",
        note: "Drainage tray included, for succulents.",
        description:
          "A spiral-ribbed planter sized for succulents and small houseplants, with a matching drainage tray printed to fit.",
        sizes: ["12 cm diameter", "Includes drainage tray"],
        seo: {
          title: "“Spiral” planter",
          description: "A spiral-ribbed planter sized for succulents and small houseplants, with a matching drainage tray printed to fit.",
          keywords: ["“spiral” planter", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Cache-pot « Spirale »",
        note: "Soucoupe de drainage incluse, pour plantes grasses.",
        description:
          "Un cache-pot à côtes en spirale dimensionné pour les plantes grasses et petites plantes d’intérieur, avec une soucoupe de drainage imprimée sur mesure.",
        sizes: ["12 cm de diamètre", "Soucoupe de drainage incluse"],
        seo: {
          title: "Cache-pot « Spirale »",
          description: "Un cache-pot à côtes en spirale dimensionné pour les plantes grasses et petites plantes d’intérieur, avec une soucoupe de drainage imprimée sur mesure.",
          keywords: ["cache-pot « spirale »", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    slug: "wall-lamp",
    categoryId: "decor",
    price: { amount: 85, currency: "CAD" },
    imageCount: 4,
    translations: {
      en: {
        title: "Wall lamp",
        note: "Diffuser for an E14 bulb, warm light through the layers.",
        description:
          "A translucent PLA diffuser that lets warm light glow through the print lines. Mounts flush to the wall and takes a standard E14 bulb.",
        sizes: ["18 cm diameter", "Fits a standard E14 bulb"],
        seo: {
          title: "Wall lamp",
          description: "A translucent PLA diffuser that lets warm light glow through the print lines. Mounts flush to the wall and takes a standard E14 bulb.",
          keywords: ["wall lamp", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Applique murale",
        note: "Diffuseur pour ampoule E14, lumière chaude à travers les couches.",
        description:
          "Un diffuseur en PLA translucide qui laisse passer une lumière chaude à travers les lignes d’impression. Se fixe à plat contre le mur et reçoit une ampoule E14 standard.",
        sizes: ["18 cm de diamètre", "Reçoit une ampoule E14 standard"],
        seo: {
          title: "Applique murale",
          description: "Un diffuseur en PLA translucide qui laisse passer une lumière chaude à travers les lignes d’impression.",
          keywords: ["applique murale", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    slug: "headphone-stand",
    categoryId: "custom",
    featured: true,
    price: { amount: 28, currency: "CAD" },
    imageCount: 2,
    translations: {
      en: {
        title: "Headphone stand",
        note: "For an 18 mm desk edge, no drilling.",
        description:
          "Clamps to the edge of your desk with no drilling and no hardware — just a snug PLA fit sized to an 18 mm desktop.",
        sizes: ["Fits desks up to 18 mm thick", "Clamp, no drilling"],
        seo: {
          title: "Headphone stand",
          description: "Clamps to the edge of your desk with no drilling and no hardware — just a snug PLA fit sized to an 18 mm desktop.",
          keywords: ["headphone stand", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Support pour casque",
        note: "Pour un bord de bureau de 18 mm, sans perçage.",
        description:
          "Se fixe au bord du bureau sans perçage ni quincaillerie — juste un ajustement PLA précis, dimensionné pour un plateau de 18 mm.",
        sizes: ["Pour bureaux jusqu’à 18 mm d’épaisseur", "Serrage, sans perçage"],
        seo: {
          title: "Support pour casque",
          description: "Se fixe au bord du bureau sans perçage ni quincaillerie — juste un ajustement PLA précis, dimensionné pour un plateau de 18 mm.",
          keywords: ["support pour casque", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    slug: "coffee-grinder-part",
    categoryId: "custom",
    price: { amount: 18, currency: "CAD" },
    imageCount: 2,
    translations: {
      en: {
        title: "Coffee-grinder part",
        note: "Reverse-engineered from a worn original.",
        description:
          "Reverse-engineered from a worn original part. Send us your grinder model (or the broken piece) and we'll match the fit before printing.",
        sizes: ["Matched to your grinder model", "Send the original for reference"],
        seo: {
          title: "Coffee-grinder part",
          description: "Reverse-engineered from a worn original part. Send us your grinder model (or the broken piece) and we'll match the fit before printing.",
          keywords: ["coffee-grinder part", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Pièce de moulin à café",
        note: "Rétro-ingénierie à partir d’un original usé.",
        description:
          "Rétro-ingénierie à partir d’une pièce d’origine usée. Envoyez-nous le modèle de votre moulin (ou la pièce cassée) et nous ajusterons la forme avant l’impression.",
        sizes: ["Ajusté à votre modèle de moulin", "Envoyez l’original comme référence"],
        seo: {
          title: "Pièce de moulin à café",
          description: "Rétro-ingénierie à partir d’une pièce d’origine usée.",
          keywords: ["pièce de moulin à café", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    slug: "pcb-enclosure",
    categoryId: "custom",
    price: { amount: 30, currency: "CAD", from: true },
    imageCount: 3,
    translations: {
      en: {
        title: "PCB enclosure",
        note: "Cutouts for connectors, snap-fit, no screws.",
        description:
          "A snap-fit enclosure with cutouts for your connectors — no screws needed. Send your board dimensions or a file and we'll size the shell to fit.",
        sizes: ["Sized to your board", "Snap-fit lid, no screws"],
        seo: {
          title: "PCB enclosure",
          description: "A snap-fit enclosure with cutouts for your connectors — no screws needed. Send your board dimensions or a file and we'll size the shell to fit.",
          keywords: ["pcb enclosure", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Boîtier pour circuit imprimé",
        note: "Découpes pour les connecteurs, encliquetage, sans vis.",
        description:
          "Un boîtier à encliquetage avec des découpes pour vos connecteurs — aucune vis nécessaire. Envoyez les dimensions de votre carte ou un fichier et nous ajusterons la coque.",
        sizes: ["Dimensionné pour votre carte", "Couvercle à encliquetage, sans vis"],
        seo: {
          title: "Boîtier pour circuit imprimé",
          description: "Un boîtier à encliquetage avec des découpes pour vos connecteurs — aucune vis nécessaire.",
          keywords: ["boîtier pour circuit imprimé", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
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
  {
    slug: "cup-cat",
    categoryId: "cup-toys",
    price: { amount: 18, currency: "CAD" },
    imageCount: 2,
    translations: {
      en: {
        title: "Cup cat",
        note: "Hangs over the rim, 8 cm.",
        description:
          "A cat that hangs over the rim of your mug, paws dangling inside. Printed in one piece, no supports.",
        sizes: ["8 cm tall", "Fits rims up to 8 mm"],
        seo: {
          title: "Cup cat",
          description: "A cat that hangs over the rim of your mug, paws dangling inside. Printed in one piece, no supports.",
          keywords: ["cup cat", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Chat de tasse",
        note: "Se pose sur le bord, 8 cm.",
        description:
          "Un chat qui s’accroche au bord de votre tasse, les pattes dans le vide. Imprimé d’un seul bloc, sans supports.",
        sizes: ["8 cm de haut", "Pour bords jusqu’à 8 mm"],
        seo: {
          title: "Chat de tasse",
          description: "Un chat qui s’accroche au bord de votre tasse, les pattes dans le vide. Imprimé d’un seul bloc, sans supports.",
          keywords: ["chat de tasse", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
  {
    slug: "cup-octopus",
    categoryId: "cup-toys",
    price: { amount: 22, currency: "CAD" },
    imageCount: 2,
    translations: {
      en: {
        title: "Cup octopus",
        note: "Tentacles wrap the rim, 9 cm.",
        description:
          "An octopus whose tentacles wrap the rim of the cup. Choose any colour.",
        sizes: ["9 cm tall", "Fits rims up to 8 mm"],
        seo: {
          title: "Cup octopus",
          description: "An octopus whose tentacles wrap the rim of the cup. Choose any colour.",
          keywords: ["cup octopus", "3D printing Vancouver", "custom 3D prints Canada"],
        },
      },
      fr: {
        title: "Pieuvre de tasse",
        note: "Les tentacules entourent le bord, 9 cm.",
        description:
          "Une pieuvre dont les tentacules entourent le bord de la tasse. Couleur au choix.",
        sizes: ["9 cm de haut", "Pour bords jusqu’à 8 mm"],
        seo: {
          title: "Pieuvre de tasse",
          description: "Une pieuvre dont les tentacules entourent le bord de la tasse. Couleur au choix.",
          keywords: ["pieuvre de tasse", "impression 3D Vancouver", "impression 3D sur mesure Canada"],
        },
      },
    },
  },
];
