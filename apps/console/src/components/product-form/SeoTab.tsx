"use client";

import Checkbox from "@/components/Checkbox";
import { useT } from "@/components/LocaleProvider";
import { useProductFormContext } from "@/hooks/useProductFormContext";
import LocaleSeo from "./LocaleSeo";
import LocaleTabs from "./LocaleTabs";

export function SeoTab() {
  const t = useT().pages.products.form.seo;
  const { values, change } = useProductFormContext();

  return (
    <div className="space-y-6">
      <Checkbox
        label={t.noindexLabel}
        hint={t.noindexHint}
        checked={values.noindex}
        onChange={(e) => change({ ...values, noindex: e.target.checked })}
      />
      <LocaleTabs idPrefix="pf-seo-lang" scope="seo" renderPanel={(l) => <LocaleSeo locale={l} />} />
    </div>
  );
}

export default SeoTab;
