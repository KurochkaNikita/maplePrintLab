export type FieldStatus = "filled" | "manual";
export type OverlayRow = { label: string; status: FieldStatus; note?: string };

const ID = "mpl-marketplace-overlay";

/** Small status card in the corner. Status is text ("filled" / "do it yourself"), never colour alone. */
export function showOverlay(rows: OverlayRow[], heading = "Maple Print Lab: form filled"): void {
  document.getElementById(ID)?.remove();

  const box = document.createElement("section");
  box.id = ID;
  box.setAttribute("role", "status");
  box.setAttribute("aria-live", "polite");
  box.style.cssText =
    "position:fixed;right:16px;bottom:16px;z-index:2147483647;width:320px;max-height:70vh;overflow:auto;" +
    "background:#fff;color:#1f2933;border:2px solid #1f2933;border-radius:12px;padding:14px;" +
    "font:14px/1.4 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25)";

  const h = document.createElement("h2");
  h.textContent = heading;
  h.style.cssText = "margin:0 0 8px;font-size:15px";
  box.append(h);

  const list = document.createElement("ul");
  list.style.cssText = "margin:0 0 10px;padding:0;list-style:none";
  for (const row of rows) {
    const li = document.createElement("li");
    li.style.cssText = "padding:2px 0";
    const mark = row.status === "filled" ? "✓ Filled" : "✎ Do it yourself";
    li.textContent = `${mark}: ${row.label}${row.note ? ` (${row.note})` : ""}`;
    list.append(li);
  }
  box.append(list);

  const reminder = document.createElement("p");
  reminder.textContent = "Check everything, then press Next and Publish yourself.";
  reminder.style.cssText = "margin:0 0 10px;font-weight:600";
  box.append(reminder);

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close";
  close.style.cssText = "min-height:44px;padding:0 16px;border:2px solid #1f2933;border-radius:999px;background:#fff;cursor:pointer;font:inherit";
  close.addEventListener("click", () => box.remove());
  box.append(close);

  document.body.append(box);
}

export const showError = (message: string): void =>
  showOverlay([{ label: message, status: "manual" }], "Maple Print Lab: could not fill the form");
