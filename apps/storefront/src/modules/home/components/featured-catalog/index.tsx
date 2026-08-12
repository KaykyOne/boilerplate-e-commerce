import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

type FeaturedCatalogProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

const FeaturedCatalog = ({ products, region }: FeaturedCatalogProps) => {
  if (!products.length) {
    return null
  }

  return (
    <section className="content-container py-14 small:py-20">
      <div className="mb-8 flex items-end justify-between border-b-2 border-brand pb-5">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">Start here</p>
          <h2 className="display-heading text-3xl uppercase leading-none small:text-5xl">Featured products</h2>
        </div>
        <LocalizedClientLink href="/store" className="hidden border-b border-brand pb-1 text-[10px] font-bold uppercase tracking-[0.12em] transition hover:border-brand-accent hover:text-brand-accent xsmall:block">
          View all products →
        </LocalizedClientLink>
      </div>

      <ul className="grid grid-cols-2 gap-3 xsmall:gap-5 small:grid-cols-3 medium:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>

      <LocalizedClientLink href="/store" className="mt-8 flex h-12 items-center justify-center border border-brand bg-brand text-[10px] font-bold uppercase tracking-[0.12em] text-brand-contrast xsmall:hidden">
        View all products →
      </LocalizedClientLink>
    </section>
  )
}

export default FeaturedCatalog
