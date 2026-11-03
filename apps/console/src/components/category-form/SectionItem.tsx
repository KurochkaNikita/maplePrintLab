"use client";

import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import RepeatableItem from "@/components/RepeatableItem";
import TextareaField from "@/components/TextareaField";
import { useCategoryFormContext } from "@/hooks/useCategoryFormContext";
import { format } from "@/lib/i18n";
import { fieldId, type ProductLocale, type SectionValues } from "@/lib/categories/types";
import { errorText } from "./shared";

export interface SectionItemProps {
  locale: ProductLocale;
  index: number;
  section: SectionValues;
  onChange: (index: number, field: keyof SectionValues, value: string) => void;
  onRemove: (index: number) => void;
}

/** One text block: a heading and its paragraphs. */
export function SectionItem({ locale, index, section, onChange, onRemove }: SectionItemProps) {
  const { errors } = useCategoryFormContext();
  const dict = useT();
  const t = dict.pages.categories.form.content;
  const n = index + 1;
  const err = (key: string) => errorText(errors, `${locale}.sections.${index}.${key}`, dict);

  return (
    <RepeatableItem
      id={`cf-${locale}-sections-${index}`}
      title={format(t.sectionItemTitle, { n })}
      removeLabel={format(t.removeSection, { n })}
      onRemove={() => onRemove(index)}
    >
      <InputField
        id={fieldId(`${locale}.sections.${index}.heading`)}
        label={t.sectionHeadingLabel}
        required
        error={err("heading")}
        value={section.heading}
        onChange={(v) => onChange(index, "heading", v)}
      />
      <TextareaField
        id={fieldId(`${locale}.sections.${index}.paragraphs`)}
        label={t.sectionTextLabel}
        required
        hint={t.sectionTextHint}
        error={err("paragraphs")}
        rows={6}
        value={section.paragraphs}
        onChange={(v) => onChange(index, "paragraphs", v)}
      />
    </RepeatableItem>
  );
}

export default SectionItem;
