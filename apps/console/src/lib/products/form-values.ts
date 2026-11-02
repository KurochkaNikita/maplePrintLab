import type { ProductRecord, ProductTextInput } from "@maple-print-lab/db";
import { PRODUCT_LOCALES, type ProductFormValues, type ProductLocale, type ProductTextValues } from "./types";

const emptyText = (): ProductTextValues => ({
  title: "",
  note: "",
  description: "",
  highlights: [],
  seoTitle: "",
  seoDescription: "",
});

const toTextValues = (tr: ProductTextInput | undefined): ProductTextValues => {
  if (!tr) return emptyText();
  const { material: _material, ...text } = tr; // material is one shared field, not per language
  return { ...text, highlights: tr.highlights.map((h) => ({ ...h })) };
};

export function emptyProductValues(sortOrder: number): ProductFormValues {
  return {
    slug: "",
    categoryId: "",
    collectionIds: [],
    published: true,
    noindex: false,
    isNew: false,
    sortOrder: String(sortOrder),
    priceAmount: "",
    priceFrom: false,
    material: "",
    photos: [],
    dimensions: { cm: ["", "", ""], in: ["", "", ""] },
    translations: Object.fromEntries(PRODUCT_LOCALES.map((l) => [l, emptyText()])) as Record<
      ProductLocale,
      ProductTextValues
    >,
  };
}

export function toFormValues(product: ProductRecord): ProductFormValues {
  const str = (n: number) => String(n);
  return {
    slug: product.slug,
    categoryId: product.categoryId,
    collectionIds: product.collectionIds,
    published: product.published,
    noindex: product.noindex,
    isNew: product.isNew,
    sortOrder: str(product.sortOrder),
    priceAmount: product.priceAmount ?? "",
    priceFrom: product.priceFrom,
    material: product.translations.en?.material ?? product.translations.fr?.material ?? "",
    photos: product.images.map((img) => ({
      url: img.file,
      width: img.width,
      height: img.height,
      alts: { en: img.alts.en ?? "", fr: img.alts.fr ?? "" },
    })),
    dimensions: {
      cm: product.dimensions.cm.map(str) as [string, string, string],
      in: product.dimensions.in.map(str) as [string, string, string],
    },
    translations: Object.fromEntries(
      PRODUCT_LOCALES.map((l) => [l, toTextValues(product.translations[l])]),
    ) as Record<ProductLocale, ProductTextValues>,
  };
}
