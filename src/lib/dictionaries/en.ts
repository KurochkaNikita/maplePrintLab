const en = {
  region: "Metro Vancouver, BC, Canada",
  locality: "Vancouver",

  nav: {
    home: "Home",
    work: "Work",
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

  workCard: {
    photoSoon: "Photo soon",
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
    work: {
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
      ctaWork: "See the work",
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
    latest: {
      heading: "Latest work",
      seeAll: "See all",
      items: [
        {
          title: "Articulated dragon",
          material: "PLA",
          note: "Print-in-place, no supports, 14 cm.",
          tone: "amber" as const,
        },
        {
          title: "Faceted vase",
          material: "PETG",
          note: "Waterproof insert, matte layer finish.",
          tone: "teal" as const,
        },
        {
          title: "Headphone stand",
          material: "PLA",
          note: "Custom fit for an 18 mm desk edge.",
          tone: "charcoal" as const,
        },
      ],
    },
    trust: {
      heading: "Local printing, no warehouse",
      body: "Every piece is printed for a specific order in Metro Vancouver. That means honest lead times, material and colour chosen for the job, and no markup for shelf stock.",
      cta: "Discuss a project",
    },
  },

  work: {
    title: "Our work",
    intro:
      "Below are examples of what we print. Photos of real orders will appear here as we shoot them; for now, categories and materials.",
    categories: [
      {
        id: "toys",
        title: "Toys & collectibles",
        intro: "Durable models for play and display — with thoughtful finishing.",
        items: [
          {
            title: "Articulated dragon",
            material: "PLA",
            note: "Articulated segments, print-in-place, no supports, 14 cm.",
            tone: "amber" as const,
          },
          {
            title: "“Granite” chess set",
            material: "PLA matte",
            note: "Weighted bases, matte layer surface.",
            tone: "charcoal" as const,
          },
          {
            title: "Mechanical beetle",
            material: "PETG",
            note: "Kinetic model, gears print pre-assembled.",
            tone: "teal" as const,
          },
        ],
      },
      {
        id: "decor",
        title: "Home décor",
        intro: "Shapes that aren't in the store — matched to a specific interior.",
        items: [
          {
            title: "Faceted vase",
            material: "PETG",
            note: "Removable waterproof insert, 22 cm.",
            tone: "teal" as const,
          },
          {
            title: "“Spiral” planter",
            material: "PLA",
            note: "Drainage tray included, for succulents.",
            tone: "amber" as const,
          },
          {
            title: "Wall lamp",
            material: "PLA translucent",
            note: "Diffuser for an E14 bulb, warm light through the layers.",
            tone: "charcoal" as const,
          },
        ],
      },
      {
        id: "custom",
        title: "Custom",
        intro: "Printed from your file, or geometry reworked until it's printable.",
        items: [
          {
            title: "Headphone stand",
            material: "PLA",
            note: "For an 18 mm desk edge, no drilling.",
            tone: "charcoal" as const,
          },
          {
            title: "Coffee-grinder part",
            material: "PETG",
            note: "Reverse-engineered from a worn original.",
            tone: "amber" as const,
          },
          {
            title: "PCB enclosure",
            material: "PETG",
            note: "Cutouts for connectors, snap-fit, no screws.",
            tone: "teal" as const,
          },
        ],
      },
    ],
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
