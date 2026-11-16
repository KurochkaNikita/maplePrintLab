import type { OrderRequestItemRecord, OrderRequestRecord } from "@maple-print-lab/db";
import { productPath } from "@maple-print-lab/db/src/locales";

export type OrderRequestEmailItem = Pick<OrderRequestItemRecord, "productSlug" | "productTitle" | "productPrice" | "quantity">;

export type OrderRequestEmailInput = Pick<OrderRequestRecord, "firstName" | "lastName" | "email" | "message" | "locale" | "createdAt"> & {
  items: OrderRequestEmailItem[];
  /** Origin of the public site; the product links are built from it. Undefined when not configured. */
  siteUrl?: string;
  /** Link to the request in the admin console. */
  adminUrl: string;
};

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const LANGUAGE_NAMES = { en: "English", fr: "Français" } as const;

const money = (amount: number) => `$${Number.isInteger(amount) ? amount : amount.toFixed(2)} CAD`;

/** Sum of the lines, or null when any line has no price (a total would be misleading). */
export function estimateTotal(items: Pick<OrderRequestEmailItem, "productPrice" | "quantity">[]): number | null {
  let total = 0;
  for (const item of items) {
    if (item.productPrice === null) return null;
    total += Number(item.productPrice) * item.quantity;
  }
  return total;
}

/** Notification for the shop owner. `replyTo` is the customer, so "Reply" in the mail client writes to them. */
export function buildOrderRequestEmail(r: OrderRequestEmailInput) {
  const [first] = r.items;
  const more = r.items.length - 1;
  const subject = oneLine(`Заявка: ${first.productTitle}${more > 0 ? ` и ещё ${more}` : ""} — ${r.firstName} ${r.lastName}`);
  const when = new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Vancouver" }).format(r.createdAt);

  const lines = r.items.map((item) => ({
    title: oneLine(item.productTitle),
    detail: `${item.quantity} × ${item.productPrice ? money(Number(item.productPrice)) : "цена не указана"}`,
    url: r.siteUrl ? `${r.siteUrl}${productPath(r.locale, item.productSlug)}` : undefined,
  }));
  const total = estimateTotal(r.items);
  const totalText = total === null ? null : `Ориентировочно: ${money(total)} (цену подтверждаем отдельно)`;

  const rows: [string, string, string?][] = [
    ["Покупатель", `${r.firstName} ${r.lastName}`],
    ["Email", r.email, `mailto:${r.email}`],
    ["Комментарий", r.message ?? "—"],
    ["Язык сайта", LANGUAGE_NAMES[r.locale]],
    ["Время (Ванкувер)", when],
    ["Заявка в админке", r.adminUrl, r.adminUrl],
  ];

  const text = [
    "Товары:",
    ...lines.map((l) => `• ${l.title}: ${l.detail}${l.url ? ` (${l.url})` : ""}`),
    ...(totalText ? [totalText] : []),
    "",
    ...rows.map(([label, value, href]) => (href && href !== value ? `${label}: ${value} (${href})` : `${label}: ${value}`)),
  ].join("\n");

  const itemsHtml = `<ul style="margin:0;padding-left:18px">${lines
    .map((l) => `<li>${l.url ? `<a href="${escapeHtml(l.url)}">${escapeHtml(l.title)}</a>` : escapeHtml(l.title)} — ${escapeHtml(l.detail)}</li>`)
    .join("")}</ul>${totalText ? `<p style="margin:6px 0 0">${escapeHtml(totalText)}</p>` : ""}`;

  const rowsHtml = rows
    .map(([label, value, href]) => {
      const content = escapeHtml(value).replace(/\n/g, "<br>");
      const cell = href ? `<a href="${escapeHtml(href)}">${content}</a>` : content;
      return `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${cell}</td></tr>`;
    })
    .join("");
  const html = `<table cellpadding="6" style="font-family:sans-serif;font-size:14px;border-collapse:collapse"><tr><th align="left" valign="top">Товары</th><td>${itemsHtml}</td></tr>${rowsHtml}</table>`;

  return { subject, text, html };
}
