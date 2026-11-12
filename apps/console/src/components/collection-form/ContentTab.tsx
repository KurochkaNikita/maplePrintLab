"use client";

import LocaleContent from "./LocaleContent";
import LocaleTabs from "./LocaleTabs";

export function ContentTab() {
  return <LocaleTabs idPrefix="colf-content-lang" scope="content" renderPanel={(l) => <LocaleContent locale={l} />} />;
}

export default ContentTab;
