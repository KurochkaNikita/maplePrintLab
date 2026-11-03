"use client";

import Button from "@/components/Button";
import { useT } from "@/components/LocaleProvider";
import { useCategoryFormContext } from "@/hooks/useCategoryFormContext";
import type { ProductLocale, SectionValues } from "@/lib/categories/types";
import SectionItem from "./SectionItem";
import { withText } from "./shared";

/** The text blocks under the product grid: a heading and paragraphs (separated by a blank line). */
export function SectionsEditor({ locale }: { locale: ProductLocale }) {
  const { values, change: onChange } = useCategoryFormContext();
  const t = useT().pages.categories.form.content;
  const sections = values.translations[locale].sections;
  const headingId = `cf-${locale}-sections-heading`;

  const patch = (next: typeof sections, ...touched: string[]) => {
    onChange(withText(values, locale, { sections: next }), ...touched.map((key) => `${locale}.${key}`));
  };

  const setSection = (index: number, field: keyof SectionValues, value: string) => {
    patch(
      sections.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
      `sections.${index}.${field}`,
    );
  };

  const removeSection = (index: number) => {
    // Later rows shift up, so their error keys are stale: drop all section errors for this language.
    const stale = sections.flatMap((_, i) => [`sections.${i}.heading`, `sections.${i}.paragraphs`]);
    patch(sections.filter((_, i) => i !== index), ...stale);
  };

  return (
    <section aria-labelledby={headingId} className="border-t border-line pt-8">
      <h2 id={headingId} className="font-display text-lg font-semibold text-charcoal">
        {t.sectionsLabel}
      </h2>
      <p className="mt-0.5 text-sm text-ink">{t.sectionsHint}</p>

      {sections.length > 0 && (
        <ul className="mt-4 space-y-6">
          {sections.map((section, index) => (
            <SectionItem
              key={index}
              locale={locale}
              index={index}
              section={section}
              onChange={setSection}
              onRemove={removeSection}
            />
          ))}
        </ul>
      )}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="mt-3"
        onClick={() => patch([...sections, { heading: "", paragraphs: "" }])}
      >
        {t.addSection}
      </Button>
    </section>
  );
}

export default SectionsEditor;
