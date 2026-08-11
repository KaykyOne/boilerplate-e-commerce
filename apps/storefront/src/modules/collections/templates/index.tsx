import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CatalogShell from "@modules/store/components/catalog-shell"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"

export default function CollectionTemplate({ sortBy, collection, page, countryCode, optionValueIds }: { sortBy?: SortOptions; collection: HttpTypes.StoreCollection; page?: string; countryCode: string; optionValueIds?: OptionValueIds }) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  return (
    <CatalogShell title={collection.title} description={`Discover every product in the ${collection.title} collection.`} sortBy={sort} breadcrumbs={[{ label: "Collections", href: "/store" }, { label: collection.title }]}>
      <Suspense fallback={<SkeletonProductGrid numberOfProducts={collection.products?.length} />}>
        <PaginatedProducts sortBy={sort} page={pageNumber} collectionId={collection.id} countryCode={countryCode} optionValueIds={optionValueIds} />
      </Suspense>
    </CatalogShell>
  )
}
