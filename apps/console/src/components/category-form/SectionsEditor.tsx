"use client";

import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import TextareaField from "@/components/TextareaField";
import { useCategoryFormContext } from "@/hooks/useCategoryFormContext";
import TrashIcon from "@/icons/trash.svg";
import { format } from "@/lib/i18n";
import { fieldId, type ProductLocale } from "@/lib/categories/types";
import { errorText, withText } from "./shared";

/** The text blocks under the product grid: a heading and paragraphs (separated by a blank line). */
export function SectionsEditor({ locale }: { locale: ProductLocale }) {
  const { values, errors, change: onChange } = useCategoryFormContext();
  const dict = useT();
  const t = dict.pages.categories.form.content;
  const sections = values.translations[locale].sections;
  const headingId = `cf-${locale}-sections-heading`;
  const err = (key: string) => errorText(errors, `${locale}.${key}`, dict);

  const patch = (next: typeof sections, ...touched: string[]) => {
    onChange(withText(values, locale, { sections: next }), ...touched.map((key) => `${locale}.${key}`));
  };

  const setSection = (index: number, field: "heading" | "paragraphs", value: string) => {
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
          {sections.map((section, index) => {
            const n = index + 1;
            return (
              <li
              key={index}
              role="group"
              aria-labelledby={`${headingId}-${index}`}
              className="border-t border-line pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 id={`${headingId}-${index}`} className="text-sm font-semibold text-charcoal">
                  {format(t.sectionItemTitle, { n })}
                </h3>
                <IconButton icon={TrashIcon} tone="danger" label={format(t.removeSection, { n })} className="-mr-2" onClick={() => removeSection(index)} />
              </div>
              <div className="mt-2 grid gap-4">
                <InputField
                  id={fieldId(`${locale}.sections.${index}.heading`)}
                  label={t.sectionHeadingLabel}
                  required
                  error={err(`sections.${index}.heading`)}
                  value={section.heading}
                  onChange={(v) => setSection(index, "heading", v)}
                />
                <TextareaField
                  id={fieldId(`${locale}.sections.${index}.paragraphs`)}
                  label={t.sectionTextLabel}
                  required
                  hint={t.sectionTextHint}
                  error={err(`sections.${index}.paragraphs`)}
                  rows={6}
                  value={section.paragraphs}
                  onChange={(v) => setSection(index, "paragraphs", v)}
                />
              </div>
            </li>
            );
          })}
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
