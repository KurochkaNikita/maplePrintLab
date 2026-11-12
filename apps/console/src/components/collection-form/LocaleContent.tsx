"use client";

import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import TextareaField from "@/components/TextareaField";
import { useCollectionFormContext } from "@/hooks/useCollectionFormContext";
import { fieldId, type ProductLocale } from "@/lib/collections/types";
import { errorText, withText } from "./shared";

export function LocaleContent({ locale }: { locale: ProductLocale }) {
  const { values, errors, change: onChange } = useCollectionFormContext();
  const dict = useT();
  const t = dict.pages.collections.form.content;
  const err = (key: string) => errorText(errors, `${locale}.${key}`, dict);
  const text = values.translations[locale];

  const patch = (next: Partial<typeof text>, key: string) => onChange(withText(values, locale, next), `${locale}.${key}`);

  return (
    <div className="grid gap-6">
      <InputField
        id={fieldId(`${locale}.title`)}
        label={t.titleLabel}
        required
        error={err("title")}
        value={text.title}
        onChange={(v) => patch({ title: v }, "title")}
      />

      <TextareaField
        id={fieldId(`${locale}.intro`)}
        label={t.introLabel}
        required
        hint={t.introHint}
        error={err("intro")}
        rows={4}
        value={text.intro}
        onChange={(v) => patch({ intro: v }, "intro")}
      />
    </div>
  );
}

export default LocaleContent;
