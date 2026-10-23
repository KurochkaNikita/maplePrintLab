/**
 * One-off import of the file-based catalogue (`src/db`) into Postgres.
 * Re-runnable: wipes catalogue tables, then inserts everything again.
 * Run: yarn workspace @maple-print-lab/db db:seed
 */
import { categories as fileCategories, collections as fileCollections, products as fileProducts } from "@/db";
import { createDb } from "../src";
import * as t from "../src";

try {
  process.loadEnvFile(new URL("../../../apps/console/.env.local", import.meta.url));
} catch {}

const db = createDb();

async function main() {
  // Children first. Products cascade to translations, images and collection links.
  await db.delete(t.products);
  await db.delete(t.categories);
  await db.delete(t.collections);

  await db.insert(t.categories).values(
    fileCategories.map((c, i) => ({
      id: c.id,
      customColours: c.customColours ?? false,
      priceTiers: c.priceTiers ?? null,
      sortOrder: i,
    })),
  );
  await db.insert(t.categoryTranslations).values(
    fileCategories.flatMap((c) =>
      Object.entries(c.translations).map(([locale, tr]) => ({
        categoryId: c.id,
        locale,
        title: tr.title,
        intro: tr.intro,
        highlight: tr.highlight ?? null,
        seoTitle: tr.seo.title,
        seoDescription: tr.seo.description,
        seoBlock: tr.seoBlock ?? null,
      })),
    ),
  );

  await db.insert(t.collections).values(fileCollections.map((c, i) => ({ id: c.id, sortOrder: i })));
  await db.insert(t.collectionTranslations).values(
    fileCollections.flatMap((c) =>
      Object.entries(c.translations).map(([locale, tr]) => ({
        collectionId: c.id,
        locale,
        title: tr.title,
        intro: tr.intro,
        seoTitle: tr.seo.title,
        seoDescription: tr.seo.description,
      })),
    ),
  );

  const inserted = await db
    .insert(t.products)
    .values(
      fileProducts.map((p, i) => ({
        slug: p.slug,
        categoryId: p.categoryId,
        isNew: p.isNew ?? false,
        priceAmount: p.price ? String(p.price.amount) : null,
        priceCurrency: p.price?.currency ?? "CAD",
        priceFrom: p.price?.from ?? false,
        dimensions: p.dimensions,
        sortOrder: i,
      })),
    )
    .returning({ id: t.products.id, slug: t.products.slug });
  const idBySlug = new Map(inserted.map((r) => [r.slug, r.id]));
  const idOf = (slug: string) => {
    const id = idBySlug.get(slug);
    if (id === undefined) throw new Error(`No id for ${slug}`);
    return id;
  };

  await db.insert(t.productTranslations).values(
    fileProducts.flatMap((p) =>
      Object.entries(p.translations).map(([locale, tr]) => ({
        productId: idOf(p.slug),
        locale,
        title: tr.title,
        note: tr.note,
        description: tr.description,
        material: p.material[locale as keyof typeof p.material],
        highlights: tr.highlights ?? [],
        seoTitle: tr.seo.title,
        seoDescription: tr.seo.description,
      })),
    ),
  );

  const images = fileProducts.flatMap((p) =>
    p.images.map((img, position) => ({
      productId: idOf(p.slug),
      position,
      file: img.file,
      width: img.width,
      height: img.height,
      alts: Object.fromEntries(
        Object.entries(p.translations).map(([locale, tr]) => [locale, tr.imageAlts[position] ?? ""]),
      ),
    })),
  );
  if (images.length) await db.insert(t.productImages).values(images);

  const links = fileProducts.flatMap((p) =>
    (p.collectionIds ?? []).map((collectionId) => ({ productId: idOf(p.slug), collectionId })),
  );
  if (links.length) await db.insert(t.productCollections).values(links);

  console.log(
    `Seeded ${fileCategories.length} categories, ${fileCollections.length} collections, ` +
      `${fileProducts.length} products, ${images.length} images, ${links.length} collection links.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
