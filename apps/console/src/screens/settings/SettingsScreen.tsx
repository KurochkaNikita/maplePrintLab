"use client";

import { useState } from "react";
import type { FinanceOption } from "@maple-print-lab/db";
import PageHeader from "@/components/PageHeader";
import Tabs, { tabButtonId, tabPanelId, type TabItem } from "@/components/Tabs";
import type { Dictionary } from "@/lib/i18n";
import GeneralSettingsPanel from "./GeneralSettingsPanel";
import ReferencePanel from "./ReferencePanel";

export interface SettingsScreenProps {
  t: Dictionary;
  channels: FinanceOption[];
  categories: FinanceOption[];
}

type SettingsTabId = "general" | "reference";

const ID_PREFIX = "settings";

/** Settings: general options and the pick-lists used by the order and expense forms. */
export function SettingsScreen({ t, channels, categories }: SettingsScreenProps) {
  const p = t.pages.settings;
  const [active, setActive] = useState<SettingsTabId>("general");

  const tabs: TabItem<SettingsTabId>[] = [
    { id: "general", label: p.tabs.general },
    { id: "reference", label: p.tabs.reference },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={p.heading} />
      <Tabs idPrefix={ID_PREFIX} label={p.tabsLabel} tabs={tabs} active={active} onChange={setActive} />
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={tabPanelId(ID_PREFIX, tab.id)}
          aria-labelledby={tabButtonId(ID_PREFIX, tab.id)}
          hidden={tab.id !== active}
        >
          {tab.id === "general" ? (
            <GeneralSettingsPanel text={p.generalPlaceholder} />
          ) : (
            <ReferencePanel p={p} channels={channels} categories={categories} />
          )}
        </div>
      ))}
    </div>
  );
}

export default SettingsScreen;
