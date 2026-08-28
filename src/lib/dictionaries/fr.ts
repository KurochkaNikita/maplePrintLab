import type { Dictionary } from "@/lib/dictionaries/en";

const fr: Dictionary = {
  region: "Grand Vancouver, C.-B., Canada",
  locality: "Vancouver",

  nav: {
    home: "Accueil",
    work: "Réalisations",
    contact: "Contact",
    primaryAria: "Navigation principale",
    footerAria: "Navigation du pied de page",
  },

  localeSwitcher: {
    label: "Langue",
  },

  leaf: {
    alt: "Une feuille d’érable imprimée couche par couche",
  },

  workCard: {
    photoSoon: "Photo à venir",
  },

  meta: {
    defaultTitle:
      "Maple Print Lab — impression 3D sur commande dans le Grand Vancouver",
    titleTemplate: "%s — Maple Print Lab",
    description:
      "Studio local d’impression 3D dans le Grand Vancouver. Jouets, déco et modèles sur mesure — imprimés sur commande, sans entrepôt.",
    keywords: [
      "impression 3D Vancouver",
      "impression 3D sur mesure Canada",
      "jouets imprimés en 3D",
      "déco imprimée en 3D",
      "Maple Print Lab",
    ],
    work: {
      title: "Réalisations",
      description:
        "Exemples d’impression 3D de Maple Print Lab : jouets et objets de collection, déco et commandes sur mesure dans le Grand Vancouver.",
    },
    contact: {
      title: "Contact",
      description:
        "Contactez Maple Print Lab : courriel et Instagram. Impression 3D sur commande dans le Grand Vancouver, en Colombie-Britannique.",
    },
  },

  home: {
    hero: {
      title: "Imprimé sur mesure, couche par couche",
      accent:
        "Un petit studio canadien qui imprime des objets — sans entrepôt.",
      body: "Jouets, déco et modèles sur mesure. Envoyez une idée ou un fichier — on choisit le matériau, on imprime, et on vous remet la pièce finie à Vancouver.",
      ctaWork: "Voir les réalisations",
      ctaContact: "Nous écrire",
    },
    whatWeDo: {
      heading: "Ce que nous fabriquons",
      items: [
        {
          title: "Jouets et objets de collection",
          body: "Figurines, modèles articulés, pièces de jeux de société et accessoires — PLA/PETG durable, finition soignée.",
        },
        {
          title: "Déco pour la maison",
          body: "Vases, cache-pots, rangements, lampes. Des formes qu’on ne trouve pas en magasin — adaptées à votre espace.",
        },
        {
          title: "Sur mesure",
          body: "Un modèle ou une idée ? On imprime à partir de votre fichier ou on prépare la géométrie pour l’impression.",
        },
      ],
    },
    latest: {
      heading: "Réalisations récentes",
      seeAll: "Tout voir",
      items: [
        {
          title: "Dragon articulé",
          material: "PLA",
          note: "Imprimé en place, sans support, 14 cm.",
          tone: "amber" as const,
        },
        {
          title: "Vase à facettes",
          material: "PETG",
          note: "Insert étanche, finition mate des couches.",
          tone: "teal" as const,
        },
        {
          title: "Support pour casque",
          material: "PLA",
          note: "Ajusté à un bord de bureau de 18 mm.",
          tone: "charcoal" as const,
        },
      ],
    },
    trust: {
      heading: "Impression locale, sans entrepôt",
      body: "Chaque pièce est imprimée pour une commande précise dans le Grand Vancouver. Cela veut dire des délais honnêtes, un matériau et une couleur choisis pour l’usage, et aucune majoration pour du stock.",
      cta: "Discuter d’un projet",
    },
  },

  work: {
    title: "Nos réalisations",
    intro:
      "Voici des exemples de ce que nous imprimons. Les photos de commandes réelles apparaîtront ici au fur et à mesure ; pour l’instant, les catégories et les matériaux.",
    categories: [
      {
        id: "toys",
        title: "Jouets et objets de collection",
        intro:
          "Modèles durables pour jouer et exposer — avec une finition soignée.",
        items: [
          {
            title: "Dragon articulé",
            material: "PLA",
            note: "Segments articulés, imprimé en place, sans support, 14 cm.",
            tone: "amber" as const,
          },
          {
            title: "Jeu d’échecs « Granit »",
            material: "PLA mat",
            note: "Bases lestées, surface mate des couches.",
            tone: "charcoal" as const,
          },
          {
            title: "Scarabée mécanique",
            material: "PETG",
            note: "Modèle cinétique, engrenages imprimés déjà assemblés.",
            tone: "teal" as const,
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
            title: "Vase à facettes",
            material: "PETG",
            note: "Insert étanche amovible, 22 cm.",
            tone: "teal" as const,
          },
          {
            title: "Cache-pot « Spirale »",
            material: "PLA",
            note: "Soucoupe de drainage incluse, pour plantes grasses.",
            tone: "amber" as const,
          },
          {
            title: "Applique murale",
            material: "PLA translucide",
            note: "Diffuseur pour ampoule E14, lumière chaude à travers les couches.",
            tone: "charcoal" as const,
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
            title: "Support pour casque",
            material: "PLA",
            note: "Pour un bord de bureau de 18 mm, sans perçage.",
            tone: "charcoal" as const,
          },
          {
            title: "Pièce de moulin à café",
            material: "PETG",
            note: "Rétro-ingénierie à partir d’un original usé.",
            tone: "amber" as const,
          },
          {
            title: "Boîtier pour circuit imprimé",
            material: "PETG",
            note: "Découpes pour les connecteurs, encliquetage, sans vis.",
            tone: "teal" as const,
          },
        ],
      },
    ],
  },

  contact: {
    title: "Contact",
    intro:
      "Dites-nous ce que vous voulez imprimer : décrivez l’idée ou envoyez un fichier (STL, 3MF, STEP). On répond avec une estimation du matériau, du délai et du prix. Pendant la phase pilote, échanger directement est plus rapide qu’un formulaire.",
    emailLabel: "Courriel",
    instagramLabel: "Instagram",
    regionLabel: "Région",
    note: "Sur commande ; cueillette et livraison locales sur entente.",
  },

  footer: {
    contactHeading: "Contact",
    sectionsHeading: "Sections",
    rights: "Sur commande dans le Grand Vancouver, C.-B., Canada.",
  },
};

export default fr;
