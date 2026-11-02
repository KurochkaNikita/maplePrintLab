import type { ProductListItem } from "@maple-print-lab/db";
import StatusIcon from "@/components/StatusIcon";
import type { Dictionary } from "@/lib/i18n";
import EyeIcon from "@/icons/eye.svg";
import EyeOffIcon from "@/icons/eye-off.svg";
import SparkleIcon from "@/icons/sparkle.svg";

export interface ProductStatusProps {
  product: Pick<ProductListItem, "published" | "isNew">;
  labels: Dictionary["pages"]["products"]["list"];
}

/** Published / draft and "new" as small icons with tooltips (colour is never the only signal: the shapes differ). */
export function ProductStatus({ product, labels }: ProductStatusProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {product.published ? (
        <StatusIcon icon={EyeIcon} label={labels.published} className="border-green-700/30 bg-green-50 text-green-700" />
      ) : (
        <StatusIcon icon={EyeOffIcon} label={labels.draft} className="border-gray-300 bg-gray-100 text-gray-600" />
      )}
      {product.isNew && (
        <StatusIcon icon={SparkleIcon} label={labels.isNew} className="border-amber-deep/30 bg-amber/10 text-amber-deep" />
      )}
    </span>
  );
}

export default ProductStatus;
