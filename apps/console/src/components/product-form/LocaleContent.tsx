"use client";

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import { useProductFormContext } from "@/hooks/useProductFormContext";
import TextareaField from "@/components/TextareaField";
import { format } from "@/lib/i18n";
import { fieldId, type ProductLocale } from "@/lib/products/types";
import { errorText, withText } from "./shared";

export function LocaleContent({ locale }: { locale: ProductLocale }) {
  const { values, errors, change: onChange } = useProductFormContext();
  const dict = useT();
  const t = dict.pages.products.form.content;
  const err = (key: string) => errorText(errors, `${locale}.${key}`, dict);
  const text = values.translations[locale];

  const patch = (next: Partial<typeof text>, ...touched: string[]) => {
    onChange(withText(values, locale, next), ...touched.map((key) => `${locale}.${key}`));
  };

  const setHighlight = (index: number, field: "title" | "text", value: string) => {
    const highlights = text.highlights.map((h, i) => (i === index ? { ...h, [field]: value } : h));
    patch({ highlights }, `highlights.${index}.${field}`);
  };

  const removeHighlight = (index: number) => {
    // Later rows shift up, so their error keys are stale: drop all highlight errors for this language.
    const stale = text.highlights.flatMap((_, i) => [`highlights.${i}.title`, `highlights.${i}.text`]);
    patch({ highlights: text.highlights.filter((_, i) => i !== index) }, ...stale);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
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
          id={fieldId(`${locale}.note`)}
          label={t.noteLabel}
          required
          hint={t.noteHint}
          error={err("note")}
          className="sm:col-span-2"
          rows={2}
          value={text.note}
          onChange={(v) => patch({ note: v }, "note")}
        />

        <TextareaField
          id={fieldId(`${locale}.description`)}
          label={t.descriptionLabel}
          required
          hint={t.descriptionHint}
          error={err("description")}
          className="sm:col-span-2"
          rows={7}
          value={text.description}
          onChange={(v) => patch({ description: v }, "description")}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-charcoal">{t.highlightsLabel}</p>
        <p className="mt-0.5 text-sm text-ink">{t.highlightsHint}</p>

        {text.highlights.length > 0 && (
          <ul className="mt-3 space-y-4">
            {text.highlights.map((highlight, index) => {
              const n = index + 1;
              return (
                <li key={index} className="rounded-xl border border-line bg-filament/60 p-3 sm:p-4">
                  <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                    <InputField
                      id={fieldId(`${locale}.highlights.${index}.title`)}
                      label={format(t.highlightTitleLabel, { n })}
                      required
                      error={err(`highlights.${index}.title`)}
                      value={highlight.title}
                      onChange={(v) => setHighlight(index, "title", v)}
                    />
                    <TextareaField
                      id={fieldId(`${locale}.highlights.${index}.text`)}
                      label={format(t.highlightTextLabel, { n })}
                      required
                      error={err(`highlights.${index}.text`)}
                      rows={2}
                      value={highlight.text}
                      onChange={(v) => setHighlight(index, "text", v)}
                    />
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => removeHighlight(index)}>
                    {format(t.removeHighlight, { n })}
                  </Button>
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
          onClick={() => patch({ highlights: [...text.highlights, { title: "", text: "" }] })}
        >
          {t.addHighlight}
        </Button>
      </div>
    </div>
  );
}

export default LocaleContent;
