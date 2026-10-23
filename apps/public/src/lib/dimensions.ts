import { localeTag, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { ProductItem } from "@/lib/products";

/** "25 × 25 × 1.5 cm (10 × 10 × 0.6 in)" (en) / "25 × 25 × 1,5 cm (10 × 10 × 0,6 po)" (fr). */
export function formatDimensions(
  dimensions: ProductItem["dimensions"],
  lang: Locale,
  dict: Dictionary,
): string {
  const nf = new Intl.NumberFormat(localeTag[lang], { maximumFractionDigits: 1 });
  const join = (values: number[]) => values.map((v) => nf.format(v)).join(" × ");
  return `${join(dimensions.cm)} ${dict.units.cm} (${join(dimensions.in)} ${dict.units.in})`;
}
