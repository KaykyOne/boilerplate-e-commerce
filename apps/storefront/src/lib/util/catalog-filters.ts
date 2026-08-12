import { HttpTypes } from "@medusajs/types"

export const CATALOG_FILTER_KEYS = {
  availability: "availability",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  type: "typeId",
  tag: "tagId",
} as const

export type CatalogFilters = {
  availability: string[]
  minPrice?: number
  maxPrice?: number
  typeIds: string[]
  tagIds: string[]
}

export type CatalogFilterOption = {
  id: string
  label: string
  count: number
}

export type CatalogFilterFacets = {
  availability: {
    inStock: number
    outOfStock: number
  }
  currencyCode?: string
  productTypes: CatalogFilterOption[]
  tags: CatalogFilterOption[]
}

type SearchParams =
  | URLSearchParams
  | Record<string, string | string[] | undefined>

const readAll = (searchParams: SearchParams, key: string) => {
  if (typeof (searchParams as URLSearchParams).getAll === "function") {
    return (searchParams as URLSearchParams).getAll(key).filter(Boolean)
  }

  const value = (
    searchParams as Record<string, string | string[] | undefined>
  )[key]

  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  return typeof value === "string" && value ? [value] : []
}

const readNumber = (searchParams: SearchParams, key: string) => {
  const value = readAll(searchParams, key)[0]
  const parsed = value ? Number(value) : undefined

  return parsed !== undefined && Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : undefined
}

export const parseCatalogFilters = (
  searchParams: SearchParams
): CatalogFilters => {
  const validAvailability = ["in-stock", "out-of-stock"]

  return {
    availability: Array.from(
      new Set(readAll(searchParams, CATALOG_FILTER_KEYS.availability))
    ).filter((value) => validAvailability.includes(value)),
    minPrice: readNumber(searchParams, CATALOG_FILTER_KEYS.minPrice),
    maxPrice: readNumber(searchParams, CATALOG_FILTER_KEYS.maxPrice),
    typeIds: Array.from(
      new Set(readAll(searchParams, CATALOG_FILTER_KEYS.type))
    ),
    tagIds: Array.from(
      new Set(readAll(searchParams, CATALOG_FILTER_KEYS.tag))
    ),
  }
}

export const isProductInStock = (product: HttpTypes.StoreProduct) => {
  const variants = product.variants ?? []

  return variants.some(
    (variant) =>
      !variant.manage_inventory ||
      variant.allow_backorder ||
      (variant.inventory_quantity ?? 0) > 0
  )
}

export const getProductMinimumPrice = (product: HttpTypes.StoreProduct) => {
  const prices = (product.variants ?? [])
    .map((variant) => variant.calculated_price?.calculated_amount)
    .filter((amount): amount is number => typeof amount === "number")

  return prices.length ? Math.min(...prices) : undefined
}
