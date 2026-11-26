import { STORAGE_KEY, isSupportedListing, type MarketplaceListing } from "../listing";
import { CONDITION_NEW, LABELS, findDropdown, findOption, findTextField, isFormReady } from "./fields";
import { attachPhotos } from "./photos";
import { saveLastFill } from "../last-fill";
import { showError, showOverlay, type OverlayRow } from "./overlay";

const FORM_TIMEOUT_MS = 20_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Waits for the form with a MutationObserver (no fixed delay). */
function waitForForm(): Promise<boolean> {
  return new Promise((resolve) => {
    if (isFormReady()) return resolve(true);
    const observer = new MutationObserver(() => {
      if (isFormReady()) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(true);
      }
    });
    const timer = setTimeout(() => {
      observer.disconnect();
      resolve(false);
    }, FORM_TIMEOUT_MS);
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

/** Sets the value so React sees it: native setter, then input and change events. */
function setReactValue(el: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

function fillText(labels: readonly string[], value: string): boolean {
  const el = findTextField(labels);
  if (!el) return false;
  el.focus();
  setReactValue(el, value);
  return el.value === value;
}

/** Opens a dropdown and clicks the option; false when either is missing. */
async function pickOption(labels: readonly string[], option: string): Promise<boolean> {
  const trigger = findDropdown(labels);
  if (!trigger) return false;
  trigger.click();
  for (let i = 0; i < 10; i++) {
    await sleep(150);
    const item = findOption(option);
    if (item) {
      item.click();
      return true;
    }
  }
  return false;
}

async function pickLocation(city: string): Promise<boolean> {
  const el = findTextField(LABELS.location);
  if (!el) return false;
  el.focus();
  setReactValue(el, city);
  for (let i = 0; i < 10; i++) {
    await sleep(200);
    const item = findOption(city);
    if (item) {
      item.click();
      return true;
    }
  }
  return false;
}

async function fillForm(listing: MarketplaceListing): Promise<OverlayRow[]> {
  const rows: OverlayRow[] = [];
  const row = (label: string, ok: boolean) => rows.push({ label, status: ok ? "filled" : "manual" });

  row("Title", fillText(LABELS.title, listing.title));
  row("Price", fillText(LABELS.price, String(listing.price)));
  row("Description", fillText(LABELS.description, listing.description));

  try {
    const count = await attachPhotos(listing.photoUrls);
    rows.push({ label: "Photos", status: "filled", note: `${count} of ${listing.photoUrls.length}` });
  } catch {
    rows.push({ label: "Photos", status: "manual" });
  }

  row("Condition: New", await pickOption(LABELS.condition, CONDITION_NEW));
  // The category is always chosen by a person; the card only reminds which one to pick.
  rows.push({ label: "Category", status: "manual", note: listing.category });
  if (listing.location) row(`Location: ${listing.location}`, await pickLocation(listing.location));
  return rows;
}

async function main(): Promise<void> {
  const stored = (await chrome.storage.session.get(STORAGE_KEY))[STORAGE_KEY];
  if (!isSupportedListing(stored)) return; // nothing to fill: a normal visit to the form

  // Remove first, so a tab refresh never fills the form a second time.
  await chrome.storage.session.remove(STORAGE_KEY);
  // A separate copy for the popup. It is only displayed and copied, never used to fill the form.
  await saveLastFill({ listing: stored, state: "filling" });

  if (!(await waitForForm())) {
    await saveLastFill({ listing: stored, state: "form-not-found" });
    showError("The form did not load in 20 seconds. Reload the page and send the product again.");
    return;
  }
  const rows = await fillForm(stored);
  showOverlay(rows);
  await saveLastFill({ listing: stored, state: "done", rows });
}

void main();
