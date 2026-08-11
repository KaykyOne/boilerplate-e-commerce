import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import QuickAdd from "@modules/products/components/quick-add"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({ product }: { product: HttpTypes.StoreProduct; isFeatured?: boolean; region: HttpTypes.StoreRegion }) {
  const { cheapestPrice } = getProductPrice({ product })
  const variants = product.variants ?? []
  const inStock = variants.some((variant) => !variant.manage_inventory || variant.allow_backorder || (variant.inventory_quantity ?? 0) > 0)

  return (
    <article className="group flex h-full flex-col" data-testid="product-wrapper">
      <LocalizedClientLink href={`/products/${product.handle}`} className="relative block overflow-hidden rounded-[var(--radius-card)]">
        <Thumbnail thumbnail={product.thumbnail} images={product.images} size="full" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {cheapestPrice?.price_type === "sale" && <span className="rounded-full bg-brand-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Sale</span>}
          {!inStock && <span className="rounded-full bg-brand-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Sold out</span>}
        </div>
        <span className="absolute inset-x-3 bottom-3 translate-y-3 rounded-md bg-brand-surface/90 px-3 py-2 text-center text-xs font-semibold opacity-0 backdrop-blur transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">View details</span>
      </LocalizedClientLink>
      <div className="flex flex-1 flex-col pt-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-muted">{product.type?.value || product.collection?.title || "Product"}</p>
        <LocalizedClientLink href={`/products/${product.handle}`} className="line-clamp-2 min-h-11 text-sm font-semibold leading-5 hover:text-brand-accent" data-testid="product-title">{product.title}</LocalizedClientLink>
        <div className="mt-2 flex min-h-6 items-center gap-2">{cheapestPrice && <PreviewPrice price={cheapestPrice} />}</div>
        <div className="mt-4"><QuickAdd product={product} /></div>
      </div>
    </article>
  )
}
