import type { ProductRecord } from "@maple-print-lab/db";
import Link from "next/link";
import { formatMoney } from "@/lib/finance/format";
import { format, type Dictionary, type Locale } from "@/lib/i18n";
import { basePrice, unitMargin } from "@/lib/products/margin";
import InfoRow from "./InfoRow";
import PriceTiersTable from "./PriceTiersTable";

export interface ProductInfoCardProps {
  t: Dictionary["pages"]["products"]["view"]["info"];
  locale: Locale;
  product: ProductRecord;
  collectionTitles: string[];
}

const join = (values: readonly number[]) => values.join(" × ");

/** Price, cost, margin per piece, size, collections and the last change. Read-only: copy and SEO live in the editor. */
export function ProductInfoCard({ t, locale, product, collectionTitles }: ProductInfoCardProps) {
  const money = (amount: number) => formatMoney(amount, locale);
  const base = basePrice(product);
  const margin = unitMargin(product);
  const percent = (value: number) => new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(value / 100);
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(product.updatedAt);
  const tiers = product.priceTiers;

  return (
    <section aria-labelledby="product-info-heading" className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-6">
      <h2 id="product-info-heading" className="font-display text-lg font-semibold text-charcoal">{t.heading}</h2>
      <dl className="mt-2 divide-y divide-line">
        <InfoRow label={t.price}>
          {tiers ? (
            <PriceTiersTable t={t} locale={locale} tiers={tiers} />
          ) : base ? (
            product.priceFrom ? format(t.priceFrom, { amount: money(base.price) }) : money(base.price)
          ) : (
            t.priceNone
          )}
        </InfoRow>
        <InfoRow label={t.cost}>
          {product.costAmount === null ? (
            <>
              {t.costNone}.{" "}
              <Link href={`/products/${product.id}/edit`} className="inline-flex min-h-11 items-center font-medium text-amber-deep underline underline-offset-4">
                {t.costEdit}
              </Link>
            </>
          ) : (
            money(Number(product.costAmount))
          )}
        </InfoRow>
        <InfoRow label={t.margin}>
          {margin ? (
            <>
              {format(t.marginValue, { amount: money(margin.amount), percent: margin.percent === null ? "—" : percent(margin.percent) })}
              {margin.fromFirstTier && <span className="block text-ink">{t.marginTiersNote}</span>}
            </>
          ) : (
            t.marginNone
          )}
        </InfoRow>
        <InfoRow label={t.dimensions}>
          {format(t.dimensionsValue, { cm: join(product.dimensions.cm), inch: join(product.dimensions.in) })}
        </InfoRow>
        <InfoRow label={t.collections}>{collectionTitles.length ? collectionTitles.join(", ") : t.collectionsNone}</InfoRow>
        <InfoRow label={t.updated}>{updated}</InfoRow>
      </dl>
    </section>
  );
}

export default ProductInfoCard;
