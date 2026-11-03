ALTER TABLE "categories" ADD COLUMN "cover" jsonb;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "price_tiers" jsonb;--> statement-breakpoint
-- 0001_add_product_noindex has no SQL file in the repo, so this stays idempotent.
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "noindex" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_default_uq" ON "categories" USING btree ("is_default") WHERE "categories"."is_default";--> statement-breakpoint
-- Volume pricing moves from the category to each of its products before the column is dropped.
UPDATE "products" SET "price_tiers" = "categories"."price_tiers" FROM "categories" WHERE "categories"."id" = "products"."category_id" AND "categories"."price_tiers" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "price_tiers";--> statement-breakpoint
-- The fallback category: products of a deleted category move here.
INSERT INTO "categories" ("id", "is_default", "published", "sort_order") VALUES ('other', true, true, 1000) ON CONFLICT ("id") DO UPDATE SET "is_default" = true;--> statement-breakpoint
INSERT INTO "category_translations" ("category_id", "locale", "title", "intro", "seo_title", "seo_description") VALUES
  ('other', 'en', 'Other', 'More 3D-printed pieces, made to order in Canada.', 'Other 3D-Printed Pieces', 'More 3D-printed pieces, made to order in Canada. Browse the rest of the Maple Print Lab catalogue.'),
  ('other', 'fr', 'Autres', 'D’autres pièces imprimées en 3D, fabriquées sur commande au Canada.', 'Autres pièces imprimées en 3D', 'D’autres pièces imprimées en 3D, fabriquées sur commande au Canada. Parcourez le reste du catalogue Maple Print Lab.')
ON CONFLICT DO NOTHING;
