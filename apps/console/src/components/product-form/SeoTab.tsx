"use client";

import Checkbox from "@/components/Checkbox";
import { useT } from "@/components/LocaleProvider";
import LocaleSeo from "./LocaleSeo";
import LocaleTabs from "./LocaleTabs";
import type { LocaleTabProps } from "./shared";

export function SeoTab({ locale, onLocaleChange, ...props }: LocaleTabProps) {
  const t = useT().pages.products.form.seo;
  const { values, onChange } = props;

  return (
    <div className="space-y-6">
      <Checkbox
        label={t.noindexLabel}
        hint={t.noindexHint}
        checked={values.noindex}
        onChange={(e) => onChange({ ...values, noindex: e.target.checked })}
      />
      <LocaleTabs
        idPrefix="pf-seo-lang"
        scope="seo"
        locale={locale}
        onLocaleChange={onLocaleChange}
        errors={props.errors}
        renderPanel={(l) => <LocaleSeo locale={l} {...props} />}
      />
    </div>
  );
}

export default SeoTab;
