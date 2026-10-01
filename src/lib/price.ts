import { localeTag, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductItem } from "@/lib/products";

/** "$65 CAD" (en) / "65 $ CA" (fr) / "From $30 CAD" for `from` prices. */
export function formatPrice(
  price: ProductItem["price"],
  lang: Locale,
  dict: Dictionary,
): string {
  const amount = new Intl.NumberFormat(localeTag[lang], {
    style: "currency",
    currency: price.currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(price.amount);
  const text = `${amount} ${dict.price.currencySuffix}`;
  return price.from ? `${dict.price.from} ${text}` : text;
}
