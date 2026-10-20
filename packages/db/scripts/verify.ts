/** Parity check: Postgres content must equal the file-based catalogue. Run: yarn workspace @maple-print-lab/db db:verify */
import { isDeepStrictEqual } from "node:util";
import { categories as fc, collections as fcol, products as fp } from "@/db";
import { createDb } from "../src/client";
import * as t from "../src/schema";

try {
  process.loadEnvFile(new URL("../../../apps/admin/.env.local", import.meta.url));
} catch {}

const db = createDb();
const errors: string[] = [];
const eq = (label: string, a: unknown, b: unknown) => {
  if (!isDeepStrictEqual(a, b)) errors.push(label);
};

const [cats, catTr, cols, colTr, prods, prodTr, imgs, links] = await Promise.all([
  db.select().from(t.categories),
  db.select().from(t.categoryTranslations),
  db.select().from(t.collections),
  db.select().from(t.collectionTranslations),
  db.select().from(t.products),
  db.select().from(t.productTranslations),
  db.select().from(t.productImages),
  db.select().from(t.productCollections),
]);

eq("category ids/order", cats.sort((a, b) => a.sortOrder - b.sortOrder).map((c) => c.id), fc.map((c) => c.id));
for (const c of fc) {
  const row = cats.find((r) => r.id === c.id);
  eq(`cat ${c.id} customColours`, row?.customColours, c.customColours ?? false);
  eq(`cat ${c.id} priceTiers`, row?.priceTiers ?? undefined, c.priceTiers);
  for (const [locale, tr] of Object.entries(c.translations)) {
    const r = catTr.find((x) => x.categoryId === c.id && x.locale === locale);
    eq(`cat ${c.id}/${locale}`, r && [r.title, r.intro, r.highlight ?? undefined, r.seoTitle, r.seoDescription, r.seoBlock ?? undefined], [tr.title, tr.intro, tr.highlight, tr.seo.title, tr.seo.description, tr.seoBlock]);
  }
}
eq("collection ids", cols.sort((a, b) => a.sortOrder - b.sortOrder).map((c) => c.id), fcol.map((c) => c.id));
for (const c of fcol)
  for (const [locale, tr] of Object.entries(c.translations)) {
    const r = colTr.find((x) => x.collectionId === c.id && x.locale === locale);
    eq(`col ${c.id}/${locale}`, r && [r.title, r.intro, r.seoTitle, r.seoDescription], [tr.title, tr.intro, tr.seo.title, tr.seo.description]);
  }

eq("product slugs/order", prods.sort((a, b) => a.sortOrder - b.sortOrder).map((p) => p.slug), fp.map((p) => p.slug));
for (const p of fp) {
  const row = prods.find((r) => r.slug === p.slug)!;
  eq(`${p.slug} base`, [row.categoryId, row.isNew, row.priceAmount === null ? undefined : Number(row.priceAmount), row.priceFrom, row.dimensions], [p.categoryId, p.isNew ?? false, p.price?.amount, p.price?.from ?? false, p.dimensions]);
  for (const [locale, tr] of Object.entries(p.translations)) {
    const r = prodTr.find((x) => x.productId === row.id && x.locale === locale);
    eq(`${p.slug}/${locale}`, r && [r.title, r.note, r.description, r.material, r.highlights, r.seoTitle, r.seoDescription], [tr.title, tr.note, tr.description, p.material[locale as "en"], tr.highlights ?? [], tr.seo.title, tr.seo.description]);
  }
  const rowImgs = imgs.filter((i) => i.productId === row.id).sort((a, b) => a.position - b.position);
  eq(`${p.slug} images`, rowImgs.map((i) => [i.file, i.width, i.height, i.alts]), p.images.map((i, k) => [i.file, i.width, i.height, Object.fromEntries(Object.entries(p.translations).map(([l, tr]) => [l, tr.imageAlts[k] ?? ""]))]));
  eq(`${p.slug} collections`, links.filter((l) => l.productId === row.id).map((l) => l.collectionId).sort(), [...(p.collectionIds ?? [])].sort());
}

if (errors.length) {
  console.error(`MISMATCH (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`OK: ${fc.length} categories, ${fcol.length} collections, ${fp.length} products match the files.`);
