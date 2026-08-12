"use client"

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import {
  CATALOG_FILTER_KEYS,
  CatalogFilterFacets,
  CatalogFilters,
  parseCatalogFilters,
} from "@lib/util/catalog-filters"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import CatalogFiltersPanel from "./catalog-filters"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  facets: CatalogFilterFacets
  sortBy: SortOptions
  "data-testid"?: string
}

const FilterContent = ({
  activeCount,
  clearFilters,
  facets,
  filters,
  setPriceRange,
  toggleValue,
}: {
  activeCount: number
  clearFilters: () => void
  facets: CatalogFilterFacets
  filters: CatalogFilters
  setPriceRange: (minimum?: number, maximum?: number) => void
  toggleValue: (key: string, value: string) => void
}) => (
  <div>
    <div className="border-b border-brand-border pb-5">
      <div className="flex items-center justify-between gap-3">
        <p className="display-heading text-2xl text-brand-foreground">Filters</p>
        {!!activeCount && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-accent hover:text-brand-foreground"
          >
            Clear ({activeCount})
          </button>
        )}
      </div>
      <p className="mt-2 text-xs leading-5 text-brand-muted">
        Refine the forge archive by stock, price, type, and collection tags.
      </p>
    </div>
    <CatalogFiltersPanel
      facets={facets}
      filters={filters}
      setPriceRange={setPriceRange}
      toggleValue={toggleValue}
    />
  </div>
)

const RefinementList = ({
  facets,
  sortBy,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filters = useMemo(
    () => parseCatalogFilters(searchParams),
    [searchParams]
  )
  const activeCount =
    filters.availability.length +
    filters.typeIds.length +
    filters.tagIds.length +
    Number(filters.minPrice !== undefined) +
    Number(filters.maxPrice !== undefined)

  const updateQueryParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      updater(params)
      params.delete("page")
      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    },
    [pathname, router, searchParams]
  )

  const setQueryParams = (name: string, value: string) =>
    updateQueryParams((params) => params.set(name, value))

  const toggleValue = (key: string, value: string) =>
    updateQueryParams((params) => {
      const values = params.getAll(key)
      params.delete(key)
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value]

      nextValues.forEach((item) => params.append(key, item))
    })

  const setPriceRange = (minimum?: number, maximum?: number) =>
    updateQueryParams((params) => {
      params.delete(CATALOG_FILTER_KEYS.minPrice)
      params.delete(CATALOG_FILTER_KEYS.maxPrice)

      if (minimum !== undefined) {
        params.set(CATALOG_FILTER_KEYS.minPrice, minimum.toString())
      }

      if (maximum !== undefined) {
        params.set(CATALOG_FILTER_KEYS.maxPrice, maximum.toString())
      }
    })

  const clearFilters = () =>
    updateQueryParams((params) => {
      Object.values(CATALOG_FILTER_KEYS).forEach((key) => params.delete(key))
    })

  const contentProps = {
    activeCount,
    clearFilters,
    facets,
    filters,
    setPriceRange,
    toggleValue,
  }

  return (
    <>
      <div className="col-span-full flex min-w-0 items-end gap-3 small:col-start-2 small:row-start-1 small:justify-end">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="h-11 flex-1 rounded-[var(--radius-control)] border border-brand-border bg-brand-surface px-4 text-left text-sm font-semibold small:hidden"
        >
          Filters{activeCount ? ` (${activeCount})` : ""}
        </button>
        <div className="min-w-0 flex-1 small:max-w-[15rem]">
          <SortProducts
            sortBy={sortBy}
            setQueryParams={setQueryParams}
            data-testid={dataTestId}
          />
        </div>
      </div>

      <aside className="sticky top-40 hidden border-t border-brand-border small:col-start-1 small:row-start-2 small:block">
        <FilterContent {...contentProps} />
      </aside>

      <Dialog
        open={mobileOpen}
        onClose={setMobileOpen}
        className="relative z-[70] small:hidden"
      >
        <div className="fixed inset-0 bg-brand-overlay/45" aria-hidden="true" />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel className="h-full w-[min(90vw,25rem)] overflow-y-auto border-l border-brand-border bg-brand-background p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <DialogTitle className="display-heading text-3xl">
                Catalog filters
              </DialogTitle>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-brand-border"
                aria-label="Close filters"
              >
                ×
              </button>
            </div>
            <FilterContent {...contentProps} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="mt-8 h-12 w-full rounded-[var(--radius-control)] bg-brand font-semibold text-brand-contrast"
            >
              View results
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default RefinementList
