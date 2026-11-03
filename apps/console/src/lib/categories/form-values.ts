import type { CategoryRecord, CategoryTextInput } from "@maple-print-lab/db";
import { PRODUCT_LOCALES, type CategoryFormValues, type CategoryTextValues, type ProductLocale } from "./types";

const emptyText = (): CategoryTextValues => ({
  title: "",
  intro: "",
  highlight: "",
  seoTitle: "",
  seoDescription: "",
  sections: [],
  faq: [],
});

const toTextValues = (tr: CategoryTextInput | undefined): CategoryTextValues => {
  if (!tr) return emptyText();
  return {
    title: tr.title,
    intro: tr.intro,
    highlight: tr.highlight ?? "",
    seoTitle: tr.seoTitle,
    seoDescription: tr.seoDescription,
    sections: (tr.seoBlock?.sections ?? []).map((s) => ({ heading: s.heading, paragraphs: s.paragraphs.join("\n\n") })),
    faq: (tr.seoBlock?.faq ?? []).map((f) => ({ ...f })),
  };
};

export function emptyCategoryValues(sortOrder: number): CategoryFormValues {
  return {
    slug: "",
    published: true,
    sortOrder: String(sortOrder),
    cover: null,
    translations: Object.fromEntries(PRODUCT_LOCALES.map((l) => [l, emptyText()])) as Record<
      ProductLocale,
      CategoryTextValues
    >,
  };
}

export function toFormValues(category: CategoryRecord): CategoryFormValues {
  return {
    slug: category.slug,
    published: category.published,
    sortOrder: String(category.sortOrder),
    cover: category.cover
      ? {
          url: category.cover.file,
          width: category.cover.width,
          height: category.cover.height,
          alts: { en: category.cover.alts.en ?? "", fr: category.cover.alts.fr ?? "" },
        }
      : null,
    translations: Object.fromEntries(
      PRODUCT_LOCALES.map((l) => [l, toTextValues(category.translations[l])]),
    ) as Record<ProductLocale, CategoryTextValues>,
  };
}
