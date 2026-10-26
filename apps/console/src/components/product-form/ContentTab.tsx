"use client";

import LocaleContent from "./LocaleContent";
import LocaleTabs from "./LocaleTabs";
import type { LocaleTabProps } from "./shared";

export function ContentTab({ locale, onLocaleChange, ...props }: LocaleTabProps) {
  return (
    <LocaleTabs
      idPrefix="pf-content-lang"
      scope="content"
      locale={locale}
      onLocaleChange={onLocaleChange}
      errors={props.errors}
      renderPanel={(l) => <LocaleContent locale={l} {...props} />}
    />
  );
}

export default ContentTab;
