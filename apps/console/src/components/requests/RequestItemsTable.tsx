import Link from "next/link";
import type { OrderRequestItemRecord } from "@maple-print-lab/db";
import { formatMoney } from "@/lib/finance/format";
import type { Dictionary, Locale } from "@/lib/i18n";
import { estimateTotal } from "@/lib/order-requests/email";

export interface RequestItemsTableProps {
  items: OrderRequestItemRecord[];
  locale: Locale;
  labels: Dictionary["pages"]["requests"]["detail"];
}

/** The lines of a request: product, quantity, price each and the line sum, with an estimated total below. */
export function RequestItemsTable({ items, locale, labels }: RequestItemsTableProps) {
  const t = labels.itemsTable;
  const total = estimateTotal(items);
  const th = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink";

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
      <table className="w-full min-w-[32rem] text-sm text-charcoal">
        <caption className="sr-only">{t.caption}</caption>
        <thead className="border-b border-line">
          <tr>
            <th scope="col" className={th}>{t.product}</th>
            <th scope="col" className={`${th} text-right`}>{t.quantity}</th>
            <th scope="col" className={`${th} text-right`}>{t.price}</th>
            <th scope="col" className={`${th} text-right`}>{t.sum}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {items.map((item) => (
            <tr key={item.id}>
              <th scope="row" className="px-4 py-3 text-left font-medium">
                {item.productId === null ? (
                  <>
                    {item.productTitle} <span className="font-normal text-ink">({labels.productDeleted})</span>
                  </>
                ) : (
                  <Link href={`/products/${item.productId}`} className="inline-block py-1 underline underline-offset-4">
                    {item.productTitle}
                  </Link>
                )}
              </th>
              <td className="px-4 py-3 text-right tabular-nums">{item.quantity}</td>
              <td className="px-4 py-3 text-right tabular-nums">{item.productPrice ? formatMoney(Number(item.productPrice), locale) : labels.noPrice}</td>
              <td className="px-4 py-3 text-right tabular-nums">{item.productPrice ? formatMoney(Number(item.productPrice) * item.quantity, locale) : labels.noPrice}</td>
            </tr>
          ))}
        </tbody>
        {total !== null && (
          <tfoot className="border-t border-line">
            <tr>
              <th scope="row" colSpan={3} className="px-4 py-3 text-right font-medium">{t.total}</th>
              <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatMoney(total, locale)}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default RequestItemsTable;
