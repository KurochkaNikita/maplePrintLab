import type { Dictionary } from "@/lib/dictionaries/en";

const fr: Dictionary = {
  region: "Coquitlam, Grand Vancouver, C.-B., Canada",
  locality: "Coquitlam",

  nav: {
    home: "Accueil",
    products: "Produits",
    about: "À propos",
    howToOrder: "Comment commander",
    contact: "Contact",
    primaryAria: "Navigation principale",
    footerAria: "Navigation du pied de page",
  },

  localeSwitcher: {
    label: "Langue",
    suggestion: "Ce site est aussi offert en français.",
    suggestionCta: "Passer au français",
    dismiss: "Plus tard",
  },

  leaf: {
    alt: "Une feuille d’érable imprimée couche par couche",
  },

  productCard: {
    photoSoon: "Photo à venir",
  },

  category: {
    breadcrumbAria: "Fil d’Ariane",
    itemsAria: "Produits de cette catégorie",
    viewAll: "Voir la catégorie",
    empty: "Rien ici pour le moment — de nouvelles pièces arrivent bientôt.",
    faqHeading: "Questions fréquentes",
  },

  price: {
    currencySuffix: "CA",
    from: "À partir de",
    perPiece: "/ pièce",
  },

  priceTiers: {
    heading: "Prix à la pièce",
    quantityHeader: "Quantité commandée",
    priceHeader: "Prix à la pièce",
    quantityUnit: "pièces",
    moreNote: "Plus de {max} pièces ? Contactez-nous pour une soumission.",
  },

  product: {
    priceLabel: "Prix",
    sizeLabel: "Dimensions",
    coloursLabel: "Couleurs",
    coloursValue: "Réalisable dans vos couleurs — demandez-nous",
    materialLabel: "Matériau",
    ctaLabel: "Se renseigner sur cette pièce",
  },

  units: {
    cm: "cm",
    in: "po",
  },

  meta: {
    serviceName: "Impression 3D sur commande",
    defaultTitle: "Maple Print Lab — art mural et jouets imprimés en 3D",
    titleTemplate: "%s — Maple Print Lab",
    description:
      "Mini tableaux multicouches et jouets pour gobelets de café imprimés en 3D sur commande à Coquitlam (Grand Vancouver). Vos couleurs, cueillette gratuite.",
    products: {
      title: "Produits",
      description:
        "Mini tableaux multicouches et jouets pour gobelets de café, imprimés en 3D sur commande à Coquitlam (Grand Vancouver). Prix, formats et couleurs.",
    },
    contact: {
      title: "Contact",
      description:
        "Commandez ou posez une question : courriel ou Instagram. Art mural et jouets imprimés en 3D sur commande à Coquitlam.",
    },
    about: {
      title: "À propos",
      description:
        "Maple Print Lab, petit studio de Coquitlam : tableaux multicouches et jouets pour gobelets de café, imprimés en 3D sur commande en PLA.",
    },
    howToOrder: {
      title: "Comment commander",
      description:
        "Comment ça marche : choisissez une pièce, indiquez vos couleurs et la quantité, impression en 5 à 7 jours ouvrables. Cueillette gratuite à Coquitlam.",
    },
  },

  home: {
    hero: {
      title: "Art et jouets imprimés en 3D, sur commande",
      accent: "Imprimés couche par couche à Coquitlam — dans les couleurs de votre choix.",
      body: "Mini tableaux multicouches pour votre étagère ou en cadeau, et jouets thématiques pour gobelets de café, d’une seule pièce à plusieurs centaines. Chaque article est imprimé à la commande : il est fait pour vous et ne dort jamais sur une tablette.",
      ctaProducts: "Voir la collection",
      ctaHowToOrder: "Comment commander",
    },
    whatWeDo: {
      heading: "Ce que nous fabriquons",
      items: [
        {
          title: "Tableaux multicouches",
          body: "Mini pièces de 25 × 25 cm avec une vraie profondeur 3D, imprimées dans les couleurs de votre choix. Sur une étagère ou au mur : un cadeau qui se remarque.",
        },
        {
          title: "Jouets pour gobelets de café",
          body: "Des jouets thématiques qui se collent sur un gobelet avec un mini autocollant. Un petit plus pour les cafés, les événements et les marques — dès 50 pièces, et le prix baisse avec la quantité.",
        },
        {
          title: "Vos couleurs, votre lot",
          body: "Une autre palette, ou un lot pour votre événement ? Dites-nous ce qu’il vous faut : on vous répond avec un prix et un délai clairs.",
        },
      ],
    },
    categories: {
      heading: "Parcourir par catégorie",
      prev: "Catégories précédentes",
      next: "Catégories suivantes",
      items: "pièces",
    },
    latest: {
      heading: "Réalisations récentes",
      seeAll: "Tout voir",
    },
    trust: {
      heading: "Sur commande, ici même à Coquitlam",
      body: "Chaque pièce est imprimée pour votre commande à Coquitlam. Vous choisissez les couleurs, on vous annonce le délai d’avance (généralement 5 à 7 jours ouvrables), et la cueillette à Coquitlam est gratuite.",
      cta: "Voir comment commander",
    },
  },

  products: {
    title: "Nos produits",
    intro:
      "Deux collections, toutes deux imprimées en 3D sur commande à Coquitlam : de mini tableaux multicouches pour la maison ou en cadeau, et des jouets thématiques pour gobelets de café. Choisissez une pièce, indiquez vos couleurs et la quantité, on s’occupe du reste.",
  },

  contact: {
    title: "Contact",
    intro:
      "Dites-nous ce que vous souhaitez : quelle pièce, dans quelles couleurs et en quelle quantité. Pour une idée sur mesure, décrivez-la ou envoyez un fichier (STL, 3MF, STEP). On vous répond avec le prix et le délai.",
    emailLabel: "Courriel",
    instagramLabel: "Instagram",
    regionLabel: "Région",
    note: "Sur commande. Cueillette gratuite à Coquitlam ; livraison ailleurs au Canada sur entente.",
  },

  about: {
    title: "Un petit studio d’impression 3D à Coquitlam",
    intro:
      "Maple Print Lab fabrique des tableaux multicouches et des jouets thématiques pour gobelets de café. Nous imprimons chaque commande au moment où elle est passée, sans stock sur des tablettes : chaque pièce peut donc être faite dans les couleurs que vous voulez.",
    sections: [
      {
        heading: "Comment nous fabriquons",
        body: "Tout est imprimé en 3D couche par couche, en PLA, un plastique léger issu de sources végétales. Les couches donnent à nos tableaux leur vraie profondeur, et l’impression sur commande nous permet de changer les couleurs pour vous.",
      },
      {
        heading: "Pourquoi sur commande",
        body: "Pas d’entrepôt, pas de pile d’invendus. Nous imprimons ce que vous demandez, en la quantité dont vous avez besoin : un tableau en cadeau ou quelques centaines de jouets pour la promotion d’un café.",
      },
      {
        heading: "Local et facile à joindre",
        body: "Nous sommes situés à Coquitlam, en Colombie-Britannique, dans le Grand Vancouver. La cueillette à Coquitlam est gratuite, et nous pouvons organiser une livraison ailleurs au Canada. Écrivez-nous directement : vous parlez aux personnes qui impriment votre commande.",
      },
    ],
    ctaHeading: "Une pièce en tête ?",
    ctaLabel: "Nous écrire",
  },

  howToOrder: {
    title: "Comment commander",
    intro:
      "C’est simple : choisissez une pièce, donnez-nous les détails, et nous confirmons le prix et le délai avant d’imprimer quoi que ce soit.",
    stepsHeading: "Quatre étapes",
    steps: [
      {
        title: "Choisissez une pièce",
        body: "Parcourez les tableaux et les jouets pour gobelets. Chaque page indique les dimensions, le matériau et le prix.",
      },
      {
        title: "Donnez-nous les détails",
        body: "Écrivez-nous par courriel ou sur Instagram avec la pièce, les couleurs souhaitées et la quantité (jouets pour gobelets : à partir de 50). Pour une idée sur mesure, décrivez-la ou envoyez un fichier (STL, 3MF, STEP).",
      },
      {
        title: "Nous confirmons",
        body: "Nous répondons avec le prix final et le délai. Rien n’est imprimé tant que les deux ne vous conviennent pas.",
      },
      {
        title: "Nous imprimons, vous récupérez",
        body: "Votre commande est imprimée en 5 à 7 jours ouvrables environ. Venez la chercher à Coquitlam ou demandez-nous d’organiser la livraison.",
      },
    ],
    factsHeading: "Bon à savoir",
    facts: [
      { label: "Délai", value: "Généralement 5 à 7 jours ouvrables. Lots plus importants : délai convenu d’avance." },
      { label: "Couleurs", value: "Au choix pour chaque pièce." },
      { label: "Commande minimale", value: "Aucune pour les tableaux. 50 pièces pour les jouets pour gobelets, avec prix dégressifs." },
      { label: "Cueillette", value: "Gratuite à Coquitlam." },
      { label: "Livraison", value: "Ailleurs au Canada sur entente. Les frais d’expédition sont indiqués avant que vous confirmiez." },
      { label: "Un problème ?", value: "Si quelque chose ne va pas avec votre commande, écrivez-nous et nous trouverons une solution." },
    ],
    ctaLabel: "Commencer ma commande",
  },

  notFound: {
    code: "Erreur 404",
    title: "Cette page est introuvable",
    body: "Le lien est peut-être brisé ou la page a peut-être été déplacée. Essayez plutôt l’un de ces liens :",
    home: "Aller à l’accueil",
    products: "Voir les produits",
    contact: "Nous écrire",
  },

  footer: {
    contactHeading: "Contact",
    sectionsHeading: "Sections",
    rights: "Sur commande à Coquitlam, C.-B., Canada.",
  },
};

export default fr;
