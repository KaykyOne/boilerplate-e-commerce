import { notFound } from "next/navigation"
import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CatalogShell from "@modules/store/components/catalog-shell"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"

export default function CategoryTemplate({ category, sortBy, page, countryCode, optionValueIds }: { category: HttpTypes.StoreProductCategory; sortBy?: SortOptions; page?: string; countryCode: string; optionValueIds?: OptionValueIds }) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  if (!category || !countryCode) notFound()
  const parents: HttpTypes.StoreProductCategory[] = []
  const collectParents = (item: HttpTypes.StoreProductCategory) => { if (item.parent_category) { parents.unshift(item.parent_category); collectParents(item.parent_category) } }
  collectParents(category)
  const breadcrumbs = [...parents.map((parent) => ({ label: parent.name, href: `/categories/${parent.handle}` })), { label: category.name }]
  const childLinks = (category.category_children ?? []).map((child) => ({ label: child.name, href: `/categories/${child.handle}` }))

  return (
    <CatalogShell title={category.name} description={category.description} sortBy={sort} breadcrumbs={breadcrumbs} childLinks={childLinks}>
      <Suspense fallback={<SkeletonProductGrid numberOfProducts={category.products?.length ?? 8} />}>
        <PaginatedProducts sortBy={sort} page={pageNumber} categoryId={category.id} countryCode={countryCode} optionValueIds={optionValueIds} />
      </Suspense>
    </CatalogShell>
  )
}
