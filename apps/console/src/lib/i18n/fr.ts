import type { Dictionary } from "./index";

export const fr: Dictionary = {
  brand: {
    name: "Maple Print Lab",
    badge: "Admin",
    titleSuffix: " — Maple Print Lab Admin",
  },
  a11y: {
    skipToContent: "Passer au contenu principal",
    primaryNav: "Sections de l’administration",
    openMenu: "Ouvrir le menu des sections",
    closeMenu: "Fermer le menu des sections",
    showPassword: "Afficher le mot de passe",
    language: "Langue de l’interface",
    passwordWarning: "Attention : le mot de passe s’affichera en clair à l’écran.",
  },
  login: {
    metaTitle: "Connexion à l’administration",
    heading: "Connexion à l’administration",
    subtitle: "Gérez le catalogue d’objets imprimés en 3D de Maple Print Lab",
    usernameLabel: "Courriel",
    passwordLabel: "Mot de passe",
    submitButton: "Se connecter",
    submittingButton: "Connexion…",
    invalidCredentialsError: "Courriel ou mot de passe incorrect",
    emptyFieldsError: "Saisissez votre courriel et votre mot de passe",
    genericError: "Connexion impossible. Veuillez réessayer.",
  },
  shell: {
    nav: {
      products: "Produits",
      categories: "Catégories",
      collections: "Collections",
      redirects: "Redirections",
    },
    logout: "Se déconnecter",
    publish: {
      button: "Publier",
      unpublishedLabel: "Modifications non publiées :",
      noChanges: "Toutes les modifications sont publiées",
      statusAriaLabel: "État de publication du catalogue",
    },
  },
  pages: {
    dashboard: {
      metaTitle: "Tableau de bord",
      heading: "Tableau de bord",
      description:
        "Choisissez une section dans le menu pour gérer les produits, les catégories, les collections et les redirections de la boutique.",
      quickLinksHeading: "Sections du catalogue",
      openSection: "Ouvrir la section",
    },
    products: {
      metaTitle: "Produits",
      heading: "Produits",
      description: "Liste et modification des modèles imprimés en 3D, des prix, des matériaux et des photos.",
      emptyTitle: "La section Produits est en cours de développement",
      emptyBody: "Les tableaux et formulaires de gestion des produits seront ajoutés à la prochaine étape.",
    },
    categories: {
      metaTitle: "Catégories",
      heading: "Catégories",
      description: "Gestion des catégories du catalogue, de leurs descriptions (EN / FR) et de leurs images de couverture.",
      emptyTitle: "La section Catégories est en cours de développement",
      emptyBody: "La création et la modification des catégories arriveront à la prochaine itération.",
    },
    collections: {
      metaTitle: "Collections",
      heading: "Collections",
      description: "Regroupements thématiques et saisonniers de produits pour la page d’accueil et les pages de destination.",
      emptyTitle: "La section Collections est en cours de développement",
      emptyBody: "La gestion des collections et l’association des produits seront disponibles une fois la base de données connectée.",
    },
    redirects: {
      metaTitle: "Redirections",
      heading: "Redirections",
      description: "Règles de redirection des anciennes URL de produits et de catégories lorsqu’un identifiant change.",
      emptyTitle: "La section Redirections est en cours de développement",
      emptyBody: "La configuration des redirections 301/308 pour la boutique arrivera avec la génération de la configuration d’hébergement.",
    },
  },
};
