import type { ProductRecord } from "@maple-print-lab/db";
import { productPath } from "@maple-print-lab/db/src/locales";
import BackLink from "@/components/BackLink";
import IconLink from "@/components/IconLink";
import MarketplaceButton from "@/components/marketplace/MarketplaceButton";
import ProductThumb from "@/components/ProductThumb";
import ExternalLinkIcon from "@/icons/external-link.svg";
import PencilIcon from "@/icons/pencil.svg";
import type { Dictionary } from "@/lib/i18n";
import { buildListing } from "@/lib/marketplace/build-listing";
import { MARKETPLACE_EXTENSION_ID } from "@/lib/marketplace/defaults";
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
        <div className="flex shrink-0 flex-wrap items-start gap-2">
          <IconLink variant="solid" icon={PencilIcon} label={t.view.edit} href={`/products/${product.id}/edit`} />
          {product.published && siteUrl && (
            <IconLink
              variant="outline"
              icon={ExternalLinkIcon}
              label={t.view.openOnSiteNewTab}
              href={`${siteUrl}${productPath("en", product.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
            />
          )}
          {product.published && siteUrl && (
            <MarketplaceButton t={t.view.marketplace} listing={buildListing(product, siteUrl)} extensionId={MARKETPLACE_EXTENSION_ID} />
          )}
        </div>
      </header>
    </div>
  );
}

export default ProductViewHeader;
