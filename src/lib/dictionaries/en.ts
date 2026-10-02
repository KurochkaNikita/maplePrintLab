const en = {
  region: "Metro Vancouver, BC, Canada",
  locality: "Vancouver",

  nav: {
    home: "Home",
    products: "Work",
    contact: "Contact",
    primaryAria: "Main navigation",
    footerAria: "Footer navigation",
  },

  localeSwitcher: {
    label: "Language",
  },

  leaf: {
    alt: "A maple leaf printing layer by layer",
  },

  productCard: {
    photoSoon: "Photo soon",
  },

  category: {
    breadcrumbAria: "Breadcrumb",
    itemsAria: "Products in this category",
    viewAll: "View category",
    empty: "Nothing here yet — new pieces are coming soon.",
    faqHeading: "Frequently asked questions",
  },

  price: {
    currencySuffix: "CAD",
    from: "From",
  },

  product: {
    priceLabel: "Price",
    sizesLabel: "Sizes",
    ctaLabel: "Ask about this piece",
  },

  meta: {
    defaultTitle: "Maple Print Lab — 3D printing on demand in Metro Vancouver",
    titleTemplate: "%s — Maple Print Lab",
    description:
      "A local 3D-printing studio in Metro Vancouver. Toys, home décor and custom models — printed on demand, no warehouse.",
    keywords: [
      "3D printing Vancouver",
      "custom 3D prints Canada",
      "3D printed toys",
      "3D printed home decor",
      "Maple Print Lab",
    ],
    products: {
      title: "Work",
      description:
        "Examples of Maple Print Lab 3D printing: toys and collectibles, home décor and custom orders in Metro Vancouver.",
    },
    contact: {
      title: "Contact",
      description:
        "Get in touch with Maple Print Lab: email and Instagram. 3D printing on demand in Metro Vancouver, BC.",
    },
  },

  home: {
    hero: {
      title: "Made to order, layer by layer",
      accent:
        "A small Canadian studio that prints things — and doesn't keep a warehouse.",
      body: "Toys, décor and custom models. Send an idea or a file — we pick the material, print it, and hand you the finished piece in Vancouver.",
      ctaProducts: "See the work",
      ctaContact: "Get in touch",
    },
    whatWeDo: {
      heading: "What we make",
      items: [
        {
          title: "Toys & collectibles",
          body: "Figures, articulated models, board-game pieces and props — durable PLA/PETG with careful finishing.",
        },
        {
          title: "Home décor",
          body: "Vases, planters, organizers, lamps. Shapes you won't find in a store — matched to your space.",
        },
        {
          title: "Custom",
          body: "Got a model or an idea? We print from your file or help get the geometry print-ready.",
        },
      ],
    },
    categories: {
      heading: "Browse by category",
      prev: "Previous categories",
      next: "Next categories",
      items: "pieces",
    },
    latest: {
      heading: "Latest work",
      seeAll: "See all",
    },
    trust: {
      heading: "Local printing, no warehouse",
      body: "Every piece is printed for a specific order in Metro Vancouver. That means honest lead times, material and colour chosen for the job, and no markup for shelf stock.",
      cta: "Discuss a project",
    },
  },

  products: {
    title: "Our work",
    intro:
      "Below are examples of what we print. Photos of real orders will appear here as we shoot them; for now, categories and materials.",
  },

  contact: {
    title: "Contact",
    intro:
      "Tell us what you need printed: describe the idea or send a file (STL, 3MF, STEP). We'll reply with an estimate of material, lead time and price. During the pilot, talking directly is faster than a form.",
    emailLabel: "Email",
    instagramLabel: "Instagram",
    regionLabel: "Region",
    note: "Made to order; local pickup and delivery by arrangement.",
  },

  footer: {
    contactHeading: "Contact",
    sectionsHeading: "Sections",
    rights: "Made to order in Metro Vancouver, BC, Canada.",
  },
};

export type Dictionary = typeof en;
export default en;
