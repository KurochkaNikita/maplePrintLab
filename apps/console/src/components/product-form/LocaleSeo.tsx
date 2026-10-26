"use client";

import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import TextareaField from "@/components/TextareaField";
import { format } from "@/lib/i18n";
import {
  fieldId,
  productPath,
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  type ProductLocale,
} from "@/lib/products/types";
import { errorText, withText, type TabProps } from "./shared";

export function LocaleSeo({ locale, values, errors, onChange }: TabProps & { locale: ProductLocale }) {
  const dict = useT();
  const t = dict.pages.products.form.seo;
  const err = (key: string) => errorText(errors, `${locale}.${key}`, dict);
  const text = values.translations[locale];

  const patch = (next: Partial<typeof text>, key: string) => onChange(withText(values, locale, next), `${locale}.${key}`);
  const counter = (value: string, max: number) => format(t.counter, { count: value.trim().length, max });

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink">
        {t.pagePath}{" "}
        <span className="font-mono text-charcoal">{productPath(locale, values.slug.trim() || "…")}</span>
      </p>

      <InputField
        id={fieldId(`${locale}.seoTitle`)}
        label={t.titleLabel}
        required
        hint={
          <>
            {format(t.titleHint, { max: SEO_TITLE_MAX })}{" "}
            <span className="font-medium text-charcoal">{counter(text.seoTitle, SEO_TITLE_MAX)}</span>
          </>
        }
        error={err("seoTitle")}
        value={text.seoTitle}
        onChange={(v) => patch({ seoTitle: v }, "seoTitle")}
      />

      <TextareaField
        id={fieldId(`${locale}.seoDescription`)}
        label={t.descriptionLabel}
        required
        hint={<span className="font-medium text-charcoal">{counter(text.seoDescription, SEO_DESCRIPTION_MAX)}</span>}
        error={err("seoDescription")}
        rows={3}
        value={text.seoDescription}
        onChange={(v) => patch({ seoDescription: v }, "seoDescription")}
      />
    </div>
  );
}

export default LocaleSeo;
