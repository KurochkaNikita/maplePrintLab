"use client";

import Button from "@/components/Button";
import { useT } from "@/components/LocaleProvider";
import { useCategoryFormContext } from "@/hooks/useCategoryFormContext";
import type { FaqValues, ProductLocale } from "@/lib/categories/types";
import FaqItem from "./FaqItem";
import { withText } from "./shared";

/** Questions and answers; they also become the page's FAQ structured data. */
export function FaqEditor({ locale }: { locale: ProductLocale }) {
  const { values, change: onChange } = useCategoryFormContext();
  const t = useT().pages.categories.form.content;
  const faq = values.translations[locale].faq;
  const headingId = `cf-${locale}-faq-heading`;

  const patch = (next: typeof faq, ...touched: string[]) => {
    onChange(withText(values, locale, { faq: next }), ...touched.map((key) => `${locale}.${key}`));
  };

  const setItem = (index: number, field: keyof FaqValues, value: string) => {
    patch(
      faq.map((f, i) => (i === index ? { ...f, [field]: value } : f)),
      `faq.${index}.${field}`,
    );
  };

  const removeItem = (index: number) => {
    const stale = faq.flatMap((_, i) => [`faq.${i}.q`, `faq.${i}.a`]);
    patch(faq.filter((_, i) => i !== index), ...stale);
  };

  return (
    <section aria-labelledby={headingId} className="border-t border-line pt-8">
      <h2 id={headingId} className="font-display text-lg font-semibold text-charcoal">
        {t.faqLabel}
      </h2>
      <p className="mt-0.5 text-sm text-ink">{t.faqHint}</p>

      {faq.length > 0 && (
        <ul className="mt-4 space-y-6">
          {faq.map((item, index) => (
            <FaqItem key={index} locale={locale} index={index} item={item} onChange={setItem} onRemove={removeItem} />
          ))}
        </ul>
      )}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="mt-3"
        onClick={() => patch([...faq, { q: "", a: "" }])}
      >
        {t.addFaq}
      </Button>
    </section>
  );
}

export default FaqEditor;
