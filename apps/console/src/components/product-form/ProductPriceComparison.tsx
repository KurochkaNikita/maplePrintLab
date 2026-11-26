"use client";

import { useT } from "@/components/LocaleProvider";
import PriceComparison from "@/components/print-cost/PriceComparison";
import { useProductFormContext } from "@/hooks/useProductFormContext";
import { lowestPrice } from "@/lib/products/lowest-price";
import { productCost } from "@/lib/products/product-cost";

/** The typed price (the lowest one of a price list) against what the cost suggests. */
export function ProductPriceComparison() {
  const { values } = useProductFormContext();
  const t = useT().printCost;

  return (
    <PriceComparison
      className="max-w-2xl"
      cost={productCost(values)}
      price={lowestPrice(values)}
      note={values.priceMode === "tiers" ? t.lowestTier : undefined}
    />
  );
}

export default ProductPriceComparison;
