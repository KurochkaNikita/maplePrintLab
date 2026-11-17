/**
 * Every Facebook-specific lookup lives here. Facebook's class names are random, so fields are found by
 * `aria-label` / label text, in ONE interface language (English US). When Facebook changes the form, edit only this file.
 */

export const LABELS = {
  title: ["Title"],
  price: ["Price"],
  description: ["Description"],
  condition: ["Condition"],
  category: ["Category"],
  location: ["Location"],
} as const;

export const CONDITION_NEW = "New";

type TextField = HTMLInputElement | HTMLTextAreaElement;

const norm = (s: string | null | undefined) => (s ?? "").trim().toLowerCase();

/** Visible element? Hidden duplicates exist in Facebook's DOM. */
export const isVisible = (el: Element): boolean => (el as HTMLElement).getClientRects().length > 0;

/** Text input or textarea whose aria-label, or wrapping <label> text, starts with one of `labels`. */
export function findTextField(labels: readonly string[]): TextField | null {
  const wanted = labels.map(norm);
  const candidates = Array.from(document.querySelectorAll<TextField>("input, textarea")).filter(isVisible);
  return (
    candidates.find((el) => wanted.includes(norm(el.getAttribute("aria-label")))) ??
    candidates.find((el) => {
      const text = norm(el.closest("label")?.textContent);
      return wanted.some((w) => text === w || text.startsWith(w));
    }) ??
    null
  );
}

/** A dropdown trigger (role=combobox or a labelled button) for `labels`. */
export function findDropdown(labels: readonly string[]): HTMLElement | null {
  const wanted = labels.map(norm);
  const candidates = Array.from(document.querySelectorAll<HTMLElement>('[role="combobox"], [role="button"], label')).filter(isVisible);
  return (
    candidates.find((el) => wanted.includes(norm(el.getAttribute("aria-label")))) ??
    candidates.find((el) => wanted.some((w) => norm(el.textContent).startsWith(w))) ??
    null
  );
}

/** An option in an opened dropdown list. */
export function findOption(text: string): HTMLElement | null {
  const wanted = norm(text);
  return (
    Array.from(document.querySelectorAll<HTMLElement>('[role="option"], [role="menuitemradio"], [role="radio"]'))
      .filter(isVisible)
      .find((el) => norm(el.textContent) === wanted || norm(el.textContent).startsWith(wanted)) ?? null
  );
}

/** The file input of the photo uploader. */
export function findPhotoInput(): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>('input[type="file"][accept*="image"]');
}

/** The form is ready when the title field exists. */
export const isFormReady = (): boolean => findTextField(LABELS.title) !== null;
