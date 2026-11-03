"use client";

import Checkbox from "@/components/Checkbox";
import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import { useCategoryFormContext } from "@/hooks/useCategoryFormContext";
import { fieldId } from "@/lib/categories/types";
import { categoryPath } from "@/lib/categories/paths";
import CoverSection from "./CoverSection";
import { errorText } from "./shared";

export function GeneralTab() {
  const { values, errors, change: onChange, isEdit, isDefault } = useCategoryFormContext();
  const dict = useT();
  const t = dict.pages.categories.form.general;
  const err = (key: string) => errorText(errors, key, dict);

  const slug = values.slug.trim() || "…";
  const slugHint = isDefault ? t.slugHintDefault : isEdit ? `${t.slugHint} ${t.slugHintEdit}` : t.slugHint;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          id={fieldId("slug")}
          label={t.slugLabel}
          required
          hint={
            <>
              {slugHint}
              <span className="mt-1 block">
                {t.slugPreview} <span className="font-mono text-charcoal">{categoryPath("en", slug)}</span>
              </span>
            </>
          }
          error={err("slug")}
          className="sm:col-span-2"
          name="slug"
          value={values.slug}
          disabled={isDefault}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(v) => onChange({ ...values, slug: v }, "slug")}
        />

        <InputField
          id={fieldId("sortOrder")}
          label={t.sortOrderLabel}
          required
          hint={t.sortOrderHint}
          error={err("sortOrder")}
          name="sortOrder"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={values.sortOrder}
          onChange={(v) => onChange({ ...values, sortOrder: v }, "sortOrder")}
        />
      </div>

      <Checkbox
        label={t.publishedLabel}
        hint={t.publishedHint}
        checked={values.published}
        onChange={(e) => onChange({ ...values, published: e.target.checked })}
      />

      <CoverSection />
    </div>
  );
}

export default GeneralTab;
