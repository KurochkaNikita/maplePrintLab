import type { Dictionary } from "@/lib/dictionaries/en";

const fr: Dictionary = {
  region: "Coquitlam, Grand Vancouver, C.-B., Canada",
  locality: "Coquitlam",

  nav: {
    home: "Accueil",
    products: "Produits",
    about: "À propos",
    privacy: "Confidentialité",
    howToOrder: "Comment commander",
    contact: "Contact",
    primaryAria: "Navigation principale",
    menu: "Menu",
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
    new: "Nouveau",
    madeToOrder: "Sur commande",
  },

  category: {
    breadcrumbAria: "Fil d’Ariane",
    itemsAria: "Produits de cette catégorie",
    viewAll: "Voir la catégorie",
    empty: "Rien ici pour le moment — de nouvelles pièces arrivent bientôt.",
    faqHeading: "Questions fréquentes",
  },

  collection: {
    itemsAria: "Produits de cette collection",
    viewAll: "Voir tout",
    heading: "Collections",
    productHeading: "Collections",
    empty: "Rien ici pour le moment — de nouvelles pièces arrivent bientôt.",
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
    gallery: {
      open: "Ouvrir la photo en plein écran",
      close: "Fermer",
      prev: "Photo précédente",
      next: "Photo suivante",
      counter: "Photo {n} sur {total}",
      thumbs: "Photos du produit",
    },
    ctaLabel: "Ajouter à la demande",
    ctaNote: "Aucun paiement maintenant — nous confirmons d’abord le prix et le délai.",
    perks: [
      "Imprimé en 3D sur commande en 5 à 7 jours ouvrables",
      "Cueillette gratuite à Coquitlam, livraison partout au Canada",
      "Les couleurs de votre choix — dites-nous simplement",
    ],
    highlightsHeading: "Pourquoi vous l’aimerez",
    exploreMore: "Découvrez plus de décorations 3D originales et d’accessoires de bureau sur Maple Print Lab !",
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
    request: {
      title: "Votre demande",
      description: "Vérifiez les pièces choisies et envoyez-nous une seule demande. Aucun paiement maintenant : nous confirmons prix et délai par courriel.",
    },
    about: {
      title: "À propos",
      description:
        "Maple Print Lab, petit studio de Coquitlam : tableaux multicouches et jouets pour gobelets de café, imprimés en 3D sur commande en PLA.",
    },
    privacy: {
      title: "Politique de confidentialité",
      description:
        "Comment Maple Print Lab traite vos données : ce que recueille notre formulaire de commande, et pourquoi l’extension Chrome Marketplace filler ne recueille rien.",
    },
    howToOrder: {
      title: "Comment commander",
      description:
        "Comment ça marche : choisissez une pièce, indiquez vos couleurs et la quantité, impression en 5 à 7 jours ouvrables. Cueillette gratuite à Coquitlam.",
    },
  },

  home: {
    perks: [
      { title: "Imprimé sur commande", body: "Prêt en 5 à 7 jours ouvrables" },
      { title: "Vos couleurs", body: "Choisissez votre palette" },
      { title: "Cueillette gratuite", body: "Coquitlam, C.-B." },
      { title: "Livraison au Canada", body: "Sur entente" },
    ],
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

  privacy: {
    badge: "Confidentialité",
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 18 novembre 2026",
    intro:
      "Maple Print Lab est un petit studio d’impression 3D de Coquitlam, C.-B., Canada. Cette page comporte deux parties : la politique générale de ce site et une politique distincte pour notre extension Chrome interne.",
    tocHeading: "Sur cette page",
    highlights: [
      { title: "Seulement ce que vous saisissez", body: "Une demande contient uniquement votre nom, votre courriel, votre message et les pièces choisies." },
      { title: "L’extension ne recueille rien", body: "Marketplace filler est un outil réservé à l’équipe qui n’envoie aucune donnée d’utilisateur." },
      { title: "Ni pub, ni traceurs", body: "Aucun témoin publicitaire ni outil d’analyse de tiers sur ce site." },
    ],
    groups: [
      {
        label: "Partie 1",
        heading: "Politique générale",
        intro: "S’applique à ce site, mapleprintlab.store.",
        sections: [
          {
            heading: "Demandes de commande",
            body: "Lorsque vous envoyez une demande, nous recueillons ce que vous saisissez dans le formulaire : prénom, nom, adresse courriel, message et pièces choisies. Nous l’utilisons uniquement pour vous répondre, confirmer le prix et les délais et fabriquer votre commande. Nous ne le vendons pas et ne l’utilisons pas à des fins publicitaires.",
          },
          {
            heading: "Protection contre le pourriel",
            body: "Le formulaire utilise Cloudflare Turnstile pour distinguer les personnes des robots. Turnstile peut traiter des données techniques comme votre adresse IP et des détails sur votre navigateur, selon la politique de confidentialité de Cloudflare.",
          },
          {
            heading: "Témoins et analyse",
            body: "Ce site n’utilise ni témoins publicitaires ni outils d’analyse de tiers.",
          },
          {
            heading: "Partage et conservation",
            body: "Les demandes sont stockées dans une base de données fournie par nos hébergeurs et ne sont visibles que par notre équipe. Nous ne communiquons vos renseignements à personne d’autre, sauf si la loi l’exige. Nous conservons une demande le temps nécessaire pour traiter votre commande et tenir nos registres, puis nous la supprimons.",
          },
          {
            heading: "Vos droits",
            body: "Vous pouvez demander en tout temps à consulter, corriger ou supprimer les renseignements que nous détenons à votre sujet en écrivant à {email}. En vertu des lois canadiennes sur la protection de la vie privée, vous pouvez aussi communiquer avec le Commissariat à la protection de la vie privée du Canada.",
          },
        ],
      },
      {
        label: "Partie 2",
        heading: "Politique de l’extension Chrome",
        intro: "S’applique à « Maple Print Lab: Marketplace filler », un outil interne pour notre équipe qui fait gagner du temps pour créer des annonces de nos produits sur d’autres plateformes. En bref, il ne recueille rien.",
        sections: [
          {
            heading: "À qui elle s’adresse",
            body: "L’extension est un outil de travail pour l’équipe de Maple Print Lab. Elle n’est pas destinée au grand public et ne sert à rien sans accès à notre console d’administration. Elle sert à créer plus vite, et avec moins d’erreurs, des annonces sur d’autres plateformes (pour l’instant, Facebook Marketplace).",
          },
          {
            heading: "Ce qu’elle fait",
            body: "Lorsqu’un membre de l’équipe clique sur « To Marketplace » dans notre console, l’extension reçoit la fiche du produit (titre, prix, description et liens des photos), ouvre la page de création d’annonce de Facebook Marketplace et remplit les champs et les photos. Elle n’appuie jamais sur Suivant ni sur Publier : une personne vérifie l’annonce et la publie.",
          },
          {
            heading: "Données recueillies",
            body: "Aucune. L’extension ne recueille, ne conserve, ne vend ni ne transmet de données personnelles ou sensibles. Elle ne lit pas votre compte Facebook, vos messages, vos contacts ni votre historique de navigation, ne voit pas les mots de passe et n’a ni analyse, ni publicité, ni traceur.",
          },
          {
            heading: "Stockage temporaire",
            body: "Pour transmettre le produit de la console à l’onglet Facebook, l’extension garde la fiche dans le stockage de session du navigateur. Elle est supprimée juste avant le remplissage du formulaire, et le navigateur l’efface de toute façon à sa fermeture. Rien n’est conservé de façon permanente.",
          },
          {
            heading: "Accès réseau",
            body: "L’extension télécharge les photos des produits depuis notre site et notre stockage public d’images pour les joindre au formulaire. Elle n’envoie aucune donnée. Elle n’accepte des messages que de notre console d’administration.",
          },
          {
            heading: "Permissions expliquées",
            body: "« storage » : garde la fiche temporairement, comme décrit plus haut. Accès à notre domaine et à notre stockage d’images : télécharge les photos des produits. Accès à facebook.com/marketplace/create : remplit le formulaire d’annonce sur cette page seulement.",
          },
          {
            heading: "Tiers",
            body: "Nous ne partageons rien avec des tiers. Ce qu’un membre de l’équipe publie sur Facebook Marketplace est traité par Facebook selon sa propre politique de confidentialité.",
          },
        ],
      },
    ],
    contactHeading: "Une question ou une demande de suppression ?",
    contactLabel: "Écrivez-nous",
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

  order: {
    heading: "Votre demande",
    intro: "Aucun paiement maintenant. Envoyez vos coordonnées et nous confirmons le prix et le délai par courriel.",
    piecesHeading: "Pièces",
    detailsHeading: "Vos coordonnées",
    added: "Ajouté à votre demande. Vous avez maintenant {count} de cette pièce.",
    addedMax: "Vous avez déjà le maximum que nous acceptons par pièce ({max}).",
    viewRequest: "Voir votre demande",
    cartLink: "Votre demande : {count} pièces",
    empty: {
      title: "Votre demande est vide",
      body: "Ajoutez les pièces qui vous plaisent, puis envoyez-les-nous en une seule demande.",
      link: "Voir les produits",
    },
    line: {
      quantity: "Quantité",
      decrease: "Diminuer la quantité de {title}",
      increase: "Augmenter la quantité de {title}",
      remove: "Retirer",
      removeAria: "Retirer {title} de votre demande",
      each: "l’unité",
      unavailable: "Cette pièce n’est plus disponible. Veuillez la retirer.",
      quantityChanged: "{title} : quantité {count}",
      removed: "{title} retiré de votre demande.",
    },
    priceNote: "Les prix sont par pièce. Nous confirmons le prix final et le délai par courriel.",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Courriel",
    message: "Commentaire",
    messageOptional: "facultatif",
    messageHint: "Couleurs, inscription, date à laquelle vous la voulez…",
    submit: "Envoyer la demande",
    sending: "Envoi en cours…",
    spamCheck: "Vérification antipourriel",
    errorSummary: "Veuillez corriger les champs marqués d’une erreur.",
    errors: {
      required: "Veuillez remplir ce champ.",
      tooLong: "Veuillez saisir au plus {max} caractères.",
      invalidEmail: "Veuillez saisir un courriel valide, comme nom@exemple.com.",
      noItems: "Votre demande est vide. Ajoutez au moins une pièce.",
      tooManyItems: "Trop de pièces différentes pour une seule demande. Veuillez en retirer.",
      invalidQuantity: "Veuillez vérifier les quantités.",
      unknownProduct: "Certaines pièces ne sont plus disponibles. Veuillez les retirer et renvoyer la demande.",
    },
    failed: "Nous n’avons pas pu envoyer votre demande. Réessayez plus tard ou écrivez-nous à {email}.",
    captcha: "Veuillez réussir la vérification antipourriel ci-dessous, puis renvoyer la demande.",
    successTitle: "Merci !",
    success: "Nous vous répondrons à {email} d’ici 1 à 2 jours ouvrables.",
    redirecting: "Retour à la page d’accueil dans quelques secondes.",
    backHome: "Retour à l’accueil",
    noscript: "Cette page nécessite JavaScript. Écrivez-nous plutôt depuis la page de contact.",
    noscriptLink: "Aller à la page de contact",
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
