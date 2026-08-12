import { Suspense } from "react"

import { OptionValueIds } from "@lib/util/product-option-filters"
import { CatalogFilters } from "@lib/util/catalog-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CatalogShell from "@modules/store/components/catalog-shell"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({ sortBy, page, countryCode, optionValueIds, query, filters }: { sortBy?: SortOptions; page?: string; countryCode: string; optionValueIds?: OptionValueIds; query?: string; filters?: CatalogFilters }) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const title = query ? `Results for “${query}”` : "All products"

  return (
    <CatalogShell title={title} description={query ? "Browse the products matching your search." : "Explore cards, figures, tabletop treasures, and collector gear."} sortBy={sort} breadcrumbs={[{ label: "Shop" }]} countryCode={countryCode} query={query}>
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts sortBy={sort} page={pageNumber} countryCode={countryCode} optionValueIds={optionValueIds} query={query} filters={filters} />
      </Suspense>
    </CatalogShell>
  )
}

export default StoreTemplate
