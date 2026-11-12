"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import FormError from "@/components/FormError";
import { useT } from "@/components/LocaleProvider";
import Tabs, { tabButtonId, tabPanelId, type TabItem } from "@/components/Tabs";
import { useCollectionFormContext } from "@/hooks/useCollectionFormContext";
import { format } from "@/lib/i18n";
import { TAB_IDS, type TabId } from "@/lib/collections/types";
import ContentTab from "./ContentTab";
import GeneralTab from "./GeneralTab";
import ProductsTab from "./ProductsTab";
import SeoTab from "./SeoTab";

const ID_PREFIX = "collection-form";
const ERROR_ID = "collection-form-error";

/** The form itself: tabs, panels and the save bar. All state comes from the context. */
export function CollectionFormLayout() {
  const dict = useT();
  const t = dict.pages.collections.form;
  const { errorCounts, errorTotal, formError, status, saving, tab, setTab, submit, isEdit, products } =
    useCollectionFormContext();

  // The product list needs a saved collection, so it is not offered on the create form.
  const tabIds = TAB_IDS.filter((id) => id !== "products" || isEdit);
  const tabs: TabItem<TabId>[] = tabIds.map((id) => ({
    id,
    label: id === "products" ? format(t.tabs.products, { count: products.length }) : t.tabs[id],
    errorCount: errorCounts[id],
    errorLabel: `, ${format(t.tabErrors, { count: errorCounts[id] })}`,
  }));

  const banner = formError ? t.errors[formError] : errorTotal ? format(t.errorSummary, { count: errorTotal }) : null;
  const statusText = status ? t.status[status] : "";
  const submitLabel = saving ? t.actions.saving : !isEdit ? t.actions.create : t.actions.save;

  const panels: Record<TabId, ReactNode> = {
    general: <GeneralTab />,
    content: <ContentTab />,
    seo: <SeoTab />,
    products: <ProductsTab />,
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <FormError id={ERROR_ID} message={banner} />

      <div>
        <Tabs idPrefix={ID_PREFIX} label={t.tabsLabel} tabs={tabs} active={tab} onChange={setTab} />
        {tabIds.map((id) => (
          <div
            key={id}
            role="tabpanel"
            id={tabPanelId(ID_PREFIX, id)}
            aria-labelledby={tabButtonId(ID_PREFIX, id)}
            hidden={tab !== id}
            className="pt-6"
          >
            {panels[id]}
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-filament/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
        <Link
          href="/collections"
          className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-charcoal underline-offset-4 hover:underline"
        >
          {dict.pages.collections.backToList}
        </Link>
        <p role="status" className="text-sm font-medium text-charcoal">
          {statusText}
        </p>
      </div>
    </form>
  );
}

export default CollectionFormLayout;
