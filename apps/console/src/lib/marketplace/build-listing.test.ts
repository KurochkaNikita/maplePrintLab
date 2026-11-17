import assert from "node:assert/strict";
import test from "node:test";
import type { ProductRecord } from "@maple-print-lab/db";
import { buildListing, listingPrice } from "./build-listing";

const base = {
  id: 7,
  slug: "black-cat",
  priceAmount: "45.60",
  priceTiers: null,
  dimensions: { cm: [25, 25, 1.5], in: [10, 10, 0.6] },
  images: [{ file: "https://x.public.blob.vercel-storage.com/a.webp", width: 1600, height: 1200, alts: {} }],
  translations: { en: { title: "Black cat", description: "A cat.", material: "PLA" } },
} as unknown as ProductRecord;

test("single price is rounded, tiers use the first tier", () => {
  assert.equal(listingPrice(base), 46);
  assert.equal(listingPrice({ priceAmount: null, priceTiers: [{ from: 1, amount: 30.2 }, { from: 5, amount: 25 }] }), 30);
});

test("description follows the template and never says handmade", () => {
  const l = buildListing(base, "https://mapleprintlab.store")!;
  assert.match(l.description, /Size: 25 × 25 × 1.5 cm \(10 × 10 × 0.6 in\)/);
  assert.match(l.description, /3D-printed to order/);
  assert.match(l.description, /https:\/\/mapleprintlab\.store\/en\/product\/black-cat\//);
  assert.doesNotMatch(l.description, /handmade/i);
  assert.equal(l.photoUrls[0], "https://x.public.blob.vercel-storage.com/a-1200.webp");
});

test("at most 10 photos, title at most 100 chars, no photo means no listing", () => {
  const many = { ...base, images: Array.from({ length: 12 }, (_, i) => ({ ...base.images[0], file: `f${i}.webp` })) };
  assert.equal(buildListing(many, "https://s")!.photoUrls.length, 10);
  const long = { ...base, translations: { en: { ...base.translations.en!, title: "x".repeat(150) } } } as ProductRecord;
  assert.equal(buildListing(long, "https://s")!.title.length, 100);
  assert.equal(buildListing({ ...base, images: [] }, "https://s"), null);
});
