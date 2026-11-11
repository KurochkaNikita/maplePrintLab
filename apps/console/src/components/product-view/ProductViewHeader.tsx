import type { ProductRecord } from "@maple-print-lab/db";
import { productPath } from "@maple-print-lab/db/src/locales";
import BackLink from "@/components/BackLink";
import ButtonLink from "@/components/ButtonLink";
import ProductThumb from "@/components/ProductThumb";
import type { Dictionary } from "@/lib/i18n";
import { productThumbUrl } from "@/lib/products/thumb-url";
import ProductViewStatus from "./ProductViewStatus";

export interface ProductViewHeaderProps {
  t: Dictionary["pages"]["products"];
  product: ProductRecord;
  categoryTitle: string | null;
  /** Origin of the public site; without it there is no "view on site" button and imported photos have no preview. */
  siteUrl?: string;
}

/** Back link, main photo, title, category, status and the two actions. */
export function ProductViewHeader({ t, product, categoryTitle, siteUrl }: ProductViewHeaderProps) {
  const title = product.translations.en?.title ?? product.slug;
  const thumb = productThumbUrl(product.slug, product.images[0]?.file ?? null, siteUrl);

  return (
    <div className="space-y-4">
      <BackLink href="/products">{t.backToList}</BackLink>
      <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <ProductThumb src={thumb} />
          <div className="min-w-0 space-y-2">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">{title}</h1>
            <p className="text-sm text-ink">{categoryTitle ?? "—"}</p>
            <ProductViewStatus published={product.published} noindex={product.noindex} isNew={product.isNew} labels={t.view} />
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <ButtonLink href={`/products/${product.id}/edit`}>{t.view.edit}</ButtonLink>
          {product.published && siteUrl && (
            <ButtonLink
              variant="secondary"
              href={`${siteUrl}${productPath("en", product.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.view.openOnSiteNewTab}
            >
              {t.view.openOnSite}
            </ButtonLink>
          )}
        </div>
      </header>
    </div>
  );
}

export default ProductViewHeader;
