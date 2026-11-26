import { LAST_FILL_KEY, readLastFill, type LastFill } from "../last-fill";
import type { MarketplaceListing } from "../listing";
import { statusText } from "../content/overlay";

const COPIED_MS = 2_000;

const byId = (id: string): HTMLElement => document.getElementById(id)!;

/** Text always goes in through textContent: listing values are never parsed as HTML. */
function element<K extends keyof HTMLElementTagNameMap>(tag: K, text = "", className = ""): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.textContent = text;
  node.className = className;
  return node;
}

function copyButton(label: string, value: string): HTMLButtonElement {
  const idle = `Copy ${label.toLowerCase()}`;
  const button = element("button", idle);
  button.type = "button";
  let timer: ReturnType<typeof setTimeout> | undefined;
  button.addEventListener("click", async () => {
    const copied = await navigator.clipboard.writeText(value).then(() => true, () => false);
    button.textContent = copied ? "✓ Copied" : "Could not copy";
    byId("announcer").textContent = copied ? `${label} copied` : `Could not copy ${label.toLowerCase()}`;
    clearTimeout(timer);
    timer = setTimeout(() => (button.textContent = idle), COPIED_MS);
  });
  return button;
}

function copyButtons(listing: MarketplaceListing): HTMLElement {
  const values: [string, string | undefined][] = [
    ["Title", listing.title],
    ["Price", String(listing.price)],
    ["Description", listing.description],
    ["Category", listing.category],
    ["Location", listing.location],
  ];
  const box = element("div", "", "copy-list");
  for (const [label, value] of values) if (value) box.append(copyButton(label, value));
  return box;
}

function fillResult(lastFill: LastFill): HTMLElement {
  if (lastFill.state === "filling") return element("p", "Filling the form… If you closed that tab, send the product again.");
  if (lastFill.state === "form-not-found") return element("p", "✎ The form did not load. Copy the values below, or send the product again.");
  const list = element("ul");
  for (const row of lastFill.rows) {
    list.append(element("li", `${statusText(row.status)}: ${row.label}${row.note ? ` (${row.note})` : ""}`));
  }
  return list;
}

function render(lastFill: LastFill | null): void {
  const target = byId("last-fill");
  if (!lastFill) {
    target.replaceChildren(element("p", "Nothing yet. A product you send appears here until you close the browser."));
    return;
  }
  const { listing } = lastFill;
  target.replaceChildren(
    element("h3", listing.title),
    element("p", `CA$${listing.price}`),
    fillResult(lastFill),
    copyButtons(listing),
  );
}

byId("version").textContent = `v${chrome.runtime.getManifest().version}`;
void readLastFill().then(render);
// The popup can be open while the form is still being filled.
chrome.storage.session.onChanged.addListener((changes) => {
  if (LAST_FILL_KEY in changes) void readLastFill().then(render);
});
