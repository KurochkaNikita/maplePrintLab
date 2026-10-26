"use client";

import type { ReactNode } from "react";
import { useT } from "@/components/LocaleProvider";
import Tabs, { tabButtonId, tabPanelId, type TabItem } from "@/components/Tabs";
import { format } from "@/lib/i18n";
import {
  PRODUCT_LOCALES,
  PRODUCT_LOCALE_LABELS,
  tabOfField,
  type FieldErrors,
  type ProductLocale,
  type TabId,
} from "@/lib/products/types";

export interface LocaleTabsProps {
  idPrefix: string;
  /** The parent tab: only errors that belong to it are counted. */
  scope: TabId;
  locale: ProductLocale;
  onLocaleChange: (locale: ProductLocale) => void;
  errors: FieldErrors;
  renderPanel: (locale: ProductLocale) => ReactNode;
}

/** Second level of tabs: one panel per language. Panels stay mounted so nothing typed is lost. */
export function LocaleTabs({ idPrefix, scope, locale, onLocaleChange, errors, renderPanel }: LocaleTabsProps) {
  const t = useT().pages.products.form;

  const tabs: TabItem<ProductLocale>[] = PRODUCT_LOCALES.map((l) => {
    const count = Object.keys(errors).filter((key) => key.startsWith(`${l}.`) && tabOfField(key) === scope).length;
    return {
      id: l,
      label: PRODUCT_LOCALE_LABELS[l],
      errorCount: count,
      errorLabel: `, ${format(t.tabErrors, { count })}`,
    };
  });

  return (
    <div>
      <Tabs variant="folder" idPrefix={idPrefix} label={t.localeTabsLabel} tabs={tabs} active={locale} onChange={onLocaleChange} />
      {PRODUCT_LOCALES.map((l) => (
        <div
          key={l}
          role="tabpanel"
          id={tabPanelId(idPrefix, l)}
          aria-labelledby={tabButtonId(idPrefix, l)}
          lang={l}
          hidden={l !== locale}
          className="rounded-b-2xl rounded-tr-2xl border border-line bg-white p-4 shadow-sm sm:p-6"
        >
          {renderPanel(l)}
        </div>
      ))}
    </div>
  );
}

export default LocaleTabs;
