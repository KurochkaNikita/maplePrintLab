import { buttonClassName } from "@/components/button-class";
import { MARKETPLACE_EXTENSION_STORE_URL } from "@/lib/marketplace/defaults";

export interface ExtensionStoreLinkProps {
  label: string;
  /** Read by screen readers only: the link opens a new tab. */
  newTab: string;
}

/** Link to the extension's Chrome Web Store page. */
export function ExtensionStoreLink({ label, newTab }: ExtensionStoreLinkProps) {
  return (
    <a href={MARKETPLACE_EXTENSION_STORE_URL} target="_blank" rel="noopener noreferrer" className={buttonClassName("secondary", "md", "text-center")}>
      {label}
      <span className="sr-only"> {newTab}</span>
    </a>
  );
}

export default ExtensionStoreLink;
