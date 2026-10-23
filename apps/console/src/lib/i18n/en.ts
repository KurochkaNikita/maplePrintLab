import type { Dictionary } from "./index";

export const en: Dictionary = {
  brand: {
    name: "Maple Print Lab",
    badge: "Admin",
    titleSuffix: " — Maple Print Lab Admin",
  },
  a11y: {
    skipToContent: "Skip to main content",
    primaryNav: "Admin sections",
    openMenu: "Open sections menu",
    closeMenu: "Close sections menu",
    showPassword: "Show password",
    language: "Interface language",
    passwordWarning: "Note: the password will be shown on screen in plain text.",
  },
  login: {
    metaTitle: "Admin sign in",
    heading: "Admin sign in",
    subtitle: "Manage the Maple Print Lab catalogue of 3D-printed work",
    usernameLabel: "Email",
    passwordLabel: "Password",
    submitButton: "Sign in",
    submittingButton: "Signing in…",
    invalidCredentialsError: "Incorrect email or password",
    emptyFieldsError: "Enter your email and password",
    genericError: "Could not sign in. Please try again.",
  },
  shell: {
    nav: {
      products: "Products",
      categories: "Categories",
      collections: "Collections",
      redirects: "Redirects",
    },
    logout: "Sign out",
    publish: {
      button: "Publish",
      unpublishedLabel: "Unpublished changes:",
      noChanges: "All changes are published",
      statusAriaLabel: "Catalogue publishing status",
    },
  },
  pages: {
    dashboard: {
      metaTitle: "Dashboard",
      heading: "Dashboard",
      description:
        "Pick a section in the menu to manage products, categories, collections and redirects for the storefront.",
      quickLinksHeading: "Catalogue sections",
      openSection: "Open section",
    },
    products: {
      metaTitle: "Products",
      heading: "Products",
      description: "List and edit 3D-printed models, prices, materials and photos.",
      emptyTitle: "The Products section is under construction",
      emptyBody: "Product tables and forms will be added in the next stage.",
    },
    categories: {
      metaTitle: "Categories",
      heading: "Categories",
      description: "Manage catalogue categories, their descriptions (EN / FR) and cover images.",
      emptyTitle: "The Categories section is under construction",
      emptyBody: "Creating and editing categories will arrive in the next iteration.",
    },
    collections: {
      metaTitle: "Collections",
      heading: "Collections",
      description: "Themed and seasonal product groups for the home page and landing sections.",
      emptyTitle: "The Collections section is under construction",
      emptyBody: "Managing collections and assigning products will be available once the database is connected.",
    },
    redirects: {
      metaTitle: "Redirects",
      heading: "Redirects",
      description: "Redirect rules for old product and category URLs when a slug changes.",
      emptyTitle: "The Redirects section is under construction",
      emptyBody: "Setting up 301/308 redirects for the storefront will arrive together with hosting config generation.",
    },
  },
};
