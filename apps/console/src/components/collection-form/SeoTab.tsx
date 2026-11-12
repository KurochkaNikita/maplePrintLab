"use client";

import LocaleSeo from "./LocaleSeo";
import LocaleTabs from "./LocaleTabs";

export function SeoTab() {
  return <LocaleTabs idPrefix="colf-seo-lang" scope="seo" renderPanel={(l) => <LocaleSeo locale={l} />} />;
}

export default SeoTab;
