"use client";

import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import RepeatableItem from "@/components/RepeatableItem";
import TextareaField from "@/components/TextareaField";
import { useCategoryFormContext } from "@/hooks/useCategoryFormContext";
import { format } from "@/lib/i18n";
import { fieldId, type FaqValues, type ProductLocale } from "@/lib/categories/types";
import { errorText } from "./shared";

export interface FaqItemProps {
  locale: ProductLocale;
  index: number;
  item: FaqValues;
  onChange: (index: number, field: keyof FaqValues, value: string) => void;
  onRemove: (index: number) => void;
}

/** One question with its answer. */
export function FaqItem({ locale, index, item, onChange, onRemove }: FaqItemProps) {
  const { errors } = useCategoryFormContext();
  const dict = useT();
  const t = dict.pages.categories.form.content;
  const n = index + 1;
  const err = (key: string) => errorText(errors, `${locale}.faq.${index}.${key}`, dict);

  return (
    <RepeatableItem
      id={`cf-${locale}-faq-${index}`}
      title={format(t.faqItemTitle, { n })}
      removeLabel={format(t.removeFaq, { n })}
      onRemove={() => onRemove(index)}
    >
      <InputField
        id={fieldId(`${locale}.faq.${index}.q`)}
        label={t.faqQuestionLabel}
        required
        error={err("q")}
        value={item.q}
        onChange={(v) => onChange(index, "q", v)}
      />
      <TextareaField
        id={fieldId(`${locale}.faq.${index}.a`)}
        label={t.faqAnswerLabel}
        required
        error={err("a")}
        rows={3}
        value={item.a}
        onChange={(v) => onChange(index, "a", v)}
      />
    </RepeatableItem>
  );
}

export default FaqItem;
