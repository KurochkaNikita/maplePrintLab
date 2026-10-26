"use client";

import Checkbox from "@/components/Checkbox";
import Field from "@/components/Field";
import InputField from "@/components/InputField";
import { useT } from "@/components/LocaleProvider";
import MultiSelect from "@/components/MultiSelect";
import SelectField from "@/components/SelectField";
import { format } from "@/lib/i18n";
import { fieldId, productPath } from "@/lib/products/types";
import type { CategoryOption, CollectionOption } from "@maple-print-lab/db";
import { errorText, type TabProps } from "./shared";

export interface GeneralTabProps extends TabProps {
  categories: CategoryOption[];
  collections: CollectionOption[];
  isEdit: boolean;
}

export function GeneralTab({ values, errors, onChange, categories, collections, isEdit }: GeneralTabProps) {
  const dict = useT();
  const t = dict.pages.products.form;
  const err = (key: string) => errorText(errors, key, dict);

  const slug = values.slug.trim() || "…";
  const collectionsError = err("collectionIds");

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <InputField
          id={fieldId("slug")}
          label={t.general.slugLabel}
          required
          hint={
            <>
              {isEdit ? `${t.general.slugHint} ${t.general.slugHintEdit}` : t.general.slugHint}
              <span className="mt-1 block">
                {t.general.slugPreview} <span className="font-mono text-charcoal">{productPath("en", slug)}</span>
              </span>
            </>
          }
          error={err("slug")}
          className="sm:col-span-2"
          name="slug"
          value={values.slug}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(v) => onChange({ ...values, slug: v }, "slug")}
        />

        <SelectField
          id={fieldId("categoryId")}
          label={t.general.categoryLabel}
          required
          error={err("categoryId")}
          name="categoryId"
          value={values.categoryId}
          onChange={(v) => onChange({ ...values, categoryId: v }, "categoryId", "priceAmount")}
        >
          <option value="">{t.general.categoryPlaceholder}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </SelectField>

        <InputField
          id={fieldId("sortOrder")}
          label={t.general.sortOrderLabel}
          required
          hint={t.general.sortOrderHint}
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

      <Field
        id={fieldId("collectionIds")}
        label={t.general.collectionsLabel}
        hint={t.general.collectionsHint}
        error={collectionsError}
      >
        {({ hasError, ...control }) => (
          <MultiSelect
            {...control}
            hasError={hasError}
            options={collections.map((c) => ({ value: c.id, label: c.title }))}
            value={values.collectionIds}
            onChange={(ids) => onChange({ ...values, collectionIds: ids }, "collectionIds")}
            placeholder={t.general.collectionsPlaceholder}
            emptyText={t.general.collectionsEmpty}
            noMatchText={t.general.collectionsNoMatch}
            removeLabel={(name) => format(t.general.collectionsRemove, { name })}
          />
        )}
      </Field>

      <div className="grid gap-x-6 sm:grid-cols-2">
        <Checkbox
          label={t.general.publishedLabel}
          hint={t.general.publishedHint}
          checked={values.published}
          onChange={(e) => onChange({ ...values, published: e.target.checked })}
        />
        <Checkbox
          label={t.general.isNewLabel}
          hint={t.general.isNewHint}
          checked={values.isNew}
          onChange={(e) => onChange({ ...values, isNew: e.target.checked })}
        />
      </div>
    </div>
  );
}

export default GeneralTab;
