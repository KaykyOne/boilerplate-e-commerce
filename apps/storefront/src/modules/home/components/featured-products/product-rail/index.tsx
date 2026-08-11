import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container py-10 small:py-16">
      <div className="mb-8 flex items-end justify-between border-b border-brand-border pb-5">
        <div><p className="eyebrow mb-2">Featured collection</p><Text className="display-heading text-3xl small:text-4xl">{collection.title}</Text></div>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all products
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 small:grid-cols-3 small:gap-x-6 medium:grid-cols-4">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} />
            </li>
          ))}
      </ul>
    </div>
  )
}
