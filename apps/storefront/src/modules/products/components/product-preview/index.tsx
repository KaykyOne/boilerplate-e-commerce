import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductBadge from "@modules/products/components/product-badge"
import QuickAdd from "@modules/products/components/quick-add"
import StockStatus from "@modules/products/components/stock-status"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({ product }: { product: HttpTypes.StoreProduct; isFeatured?: boolean; region: HttpTypes.StoreRegion }) {
  const { cheapestPrice } = getProductPrice({ product })
  const variants = product.variants ?? []
  const alwaysAvailable = variants.some((variant) => !variant.manage_inventory || variant.allow_backorder)
  const inventoryQuantity = variants.reduce((total, variant) => total + (variant.inventory_quantity ?? 0), 0)
  const inStock = alwaysAvailable || inventoryQuantity > 0
  const lowStock = !alwaysAvailable && inventoryQuantity > 0 && inventoryQuantity <= 5
  const createdAt = product.created_at ? new Date(product.created_at).getTime() : 0
  const isNew = createdAt > Date.now() - 1000 * 60 * 60 * 24 * 30
  const stockStatus = !inStock ? "out-of-stock" : lowStock ? "low-stock" : "in-stock"

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-brand-border bg-brand-surface transition duration-300 hover:-translate-y-1 hover:border-brand-accent/65 hover:shadow-[var(--shadow-card-hover)]" data-testid="product-wrapper">
      <LocalizedClientLink href={`/products/${product.handle}`} className="relative block overflow-hidden border-b border-brand-border">
        <Thumbnail thumbnail={product.thumbnail} images={product.images} size="full" className="!rounded-none !shadow-none group-hover:!shadow-none" />
        <div className="absolute left-3 top-3 flex flex-wrap items-start gap-2">
          {cheapestPrice?.price_type === "sale" && (
            <ProductBadge tone="sale">
              {cheapestPrice.percentage_diff ? `${cheapestPrice.percentage_diff}% off` : "Sale"}
            </ProductBadge>
          )}
          {isNew && <ProductBadge tone="new">New</ProductBadge>}
          {lowStock && <ProductBadge tone="warning">Low stock</ProductBadge>}
          {!inStock && <ProductBadge>Out of stock</ProductBadge>}
        </div>
        <span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-[var(--radius-sm)] border border-brand-accent/30 bg-brand/95 px-3 py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-accent opacity-0 backdrop-blur transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          Inspect artifact
        </span>
      </LocalizedClientLink>

      <div className="flex flex-1 flex-col p-3 xsmall:p-4">
        <p className="mb-2 truncate text-[9px] font-bold uppercase tracking-[0.13em] text-brand-muted">
          {product.type?.value || product.collection?.title || "Catalog"}
        </p>
        <LocalizedClientLink href={`/products/${product.handle}`} className="line-clamp-2 min-h-10 text-xs font-semibold leading-5 transition hover:text-brand-accent xsmall:text-sm" data-testid="product-title">
          {product.title}
        </LocalizedClientLink>
        <div className="mt-2 flex min-h-6 items-center gap-2">{cheapestPrice && <PreviewPrice price={cheapestPrice} />}</div>
        <div className="mt-2"><StockStatus status={stockStatus} /></div>
        <div className="mt-auto pt-4"><QuickAdd product={product} /></div>
      </div>
    </article>
  )
}
