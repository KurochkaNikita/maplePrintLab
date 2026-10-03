import { localeTag, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductItem } from "@/lib/products";

/** "$65 CAD" (en) / "65 $ CA" (fr) / "From $30 CAD" for `from` prices. */
export function formatPrice(
  price: ProductItem["price"],
  lang: Locale,
  dict: Dictionary,
): string {
  const text = `${formatAmount(price.amount, price.currency, lang)} ${dict.price.currencySuffix}`;
  return price.from ? `${dict.price.from} ${text}` : text;
}

/** Whole dollars stay "$65"; fractional prices keep cents ("$1.25"); `forceCents` keeps a column aligned ("$1.00"). */
export function formatAmount(amount: number, currency: ProductItem["price"]["currency"], lang: Locale, forceCents = false): string {
  const digits = forceCents || !Number.isInteger(amount) ? 2 : 0;
  return new Intl.NumberFormat(localeTag[lang], {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
