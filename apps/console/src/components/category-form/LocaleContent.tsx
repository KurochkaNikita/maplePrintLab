"use client";

import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import TextareaField from "@/components/TextareaField";
import { useCategoryFormContext } from "@/hooks/useCategoryFormContext";
import { fieldId, type ProductLocale } from "@/lib/categories/types";
import FaqEditor from "./FaqEditor";
import SectionsEditor from "./SectionsEditor";
import { errorText, withText } from "./shared";

export function LocaleContent({ locale }: { locale: ProductLocale }) {
  const { values, errors, change: onChange } = useCategoryFormContext();
  const dict = useT();
  const t = dict.pages.categories.form.content;
  const headingId = `cf-${locale}-main-heading`;
  const err = (key: string) => errorText(errors, `${locale}.${key}`, dict);
  const text = values.translations[locale];

  const patch = (next: Partial<typeof text>, key: string) => onChange(withText(values, locale, next), `${locale}.${key}`);

  return (
    <div className="space-y-8">
      <section aria-labelledby={headingId} className="grid gap-6 sm:grid-cols-2">
        <h2 id={headingId} className="font-display text-lg font-semibold text-charcoal sm:col-span-2">
          {t.mainHeading}
        </h2>

        <InputField
          id={fieldId(`${locale}.title`)}
          label={t.titleLabel}
          required
          error={err("title")}
          className="sm:col-span-2"
          value={text.title}
          onChange={(v) => patch({ title: v }, "title")}
        />

        <TextareaField
          id={fieldId(`${locale}.intro`)}
          label={t.introLabel}
          required
          hint={t.introHint}
          error={err("intro")}
          className="sm:col-span-2"
          rows={4}
          value={text.intro}
          onChange={(v) => patch({ intro: v }, "intro")}
        />

        <InputField
          id={fieldId(`${locale}.highlight`)}
          label={t.highlightLabel}
          hint={t.highlightHint}
          error={err("highlight")}
          className="sm:col-span-2"
          value={text.highlight}
          onChange={(v) => patch({ highlight: v }, "highlight")}
        />
      </section>

      <SectionsEditor locale={locale} />
      <FaqEditor locale={locale} />
    </div>
  );
}

export default LocaleContent;
