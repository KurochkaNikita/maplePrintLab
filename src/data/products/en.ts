import type { ProductCatalog } from "./types";

const products: ProductCatalog = [
  {
    id: "toys",
    title: "Toys & collectibles",
    intro: "Durable models for play and display — with thoughtful finishing.",
    items: [
      {
        slug: "articulated-dragon",
        title: "Articulated dragon",
        material: "PLA",
        note: "Articulated segments, print-in-place, no supports, 14 cm.",
        tone: "amber",
        price: "$65 CAD",
        sizes: ["14 cm long", "Single-piece print, no assembly"],
        description:
          "A fully articulated dragon printed in one piece with no supports — every joint moves right off the plate. PLA in a colour of your choice, hand-cleaned before it ships.",
        imageCount: 3,
      },
      {
        slug: "granite-chess-set",
        title: "“Granite” chess set",
        material: "PLA matte",
        note: "Weighted bases, matte layer surface.",
        tone: "charcoal",
        price: "$180 CAD",
        sizes: ["Board 40 × 40 cm", "King height 9.5 cm"],
        description:
          "A full 32-piece set with a mottled matte finish that reads like stone. Bases are weighted for a solid feel across the board.",
        imageCount: 4,
      },
      {
        slug: "mechanical-beetle",
        title: "Mechanical beetle",
        material: "PETG",
        note: "Kinetic model, gears print pre-assembled.",
        tone: "teal",
        price: "$40 CAD",
        sizes: ["6 cm long", "Legs and gears print pre-assembled"],
        description:
          "A kinetic beetle whose legs and internal gearing print already assembled — no glue, no small parts to lose. Wind the mechanism and watch it walk.",
        imageCount: 3,
      },
    ],
  },
  {
    id: "decor",
    title: "Home décor",
    intro: "Shapes that aren't in the store — matched to a specific interior.",
    items: [
      {
        slug: "faceted-vase",
        title: "Faceted vase",
        material: "PETG",
        note: "Removable waterproof insert, 22 cm.",
        tone: "teal",
        price: "$55 CAD",
        sizes: ["22 cm tall", "Fits a standard 1 L insert"],
        description:
          "A low-poly vase with a removable, waterproof insert, so the printed shell never touches water directly. Available in any of our standard PETG colours.",
        imageCount: 3,
      },
      {
        slug: "spiral-planter",
        title: "“Spiral” planter",
        material: "PLA",
        note: "Drainage tray included, for succulents.",
        tone: "amber",
        price: "$35 CAD",
        sizes: ["12 cm diameter", "Includes drainage tray"],
        description:
          "A spiral-ribbed planter sized for succulents and small houseplants, with a matching drainage tray printed to fit.",
        imageCount: 2,
      },
      {
        slug: "wall-lamp",
        title: "Wall lamp",
        material: "PLA translucent",
        note: "Diffuser for an E14 bulb, warm light through the layers.",
        tone: "charcoal",
        price: "$85 CAD",
        sizes: ["18 cm diameter", "Fits a standard E14 bulb"],
        description:
          "A translucent PLA diffuser that lets warm light glow through the print lines. Mounts flush to the wall and takes a standard E14 bulb.",
        imageCount: 4,
      },
    ],
  },
  {
    id: "custom",
    title: "Custom",
    intro: "Printed from your file, or geometry reworked until it's printable.",
    items: [
      {
        slug: "headphone-stand",
        title: "Headphone stand",
        material: "PLA",
        note: "For an 18 mm desk edge, no drilling.",
        tone: "charcoal",
        price: "$28 CAD",
        sizes: ["Fits desks up to 18 mm thick", "Clamp, no drilling"],
        description:
          "Clamps to the edge of your desk with no drilling and no hardware — just a snug PLA fit sized to an 18 mm desktop.",
        imageCount: 2,
      },
      {
        slug: "coffee-grinder-part",
        title: "Coffee-grinder part",
        material: "PETG",
        note: "Reverse-engineered from a worn original.",
        tone: "amber",
        price: "$18 CAD",
        sizes: ["Matched to your grinder model", "Send the original for reference"],
        description:
          "Reverse-engineered from a worn original part. Send us your grinder model (or the broken piece) and we'll match the fit before printing.",
        imageCount: 2,
      },
      {
        slug: "pcb-enclosure",
        title: "PCB enclosure",
        material: "PETG",
        note: "Cutouts for connectors, snap-fit, no screws.",
        tone: "teal",
        price: "From $30 CAD",
        sizes: ["Sized to your board", "Snap-fit lid, no screws"],
        description:
          "A snap-fit enclosure with cutouts for your connectors — no screws needed. Send your board dimensions or a file and we'll size the shell to fit.",
        imageCount: 3,
      },
    ],
  },
];

export default products;
