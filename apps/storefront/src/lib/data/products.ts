"use server"

import { sdk } from "@lib/config"
import { OptionValueIds } from "@lib/util/product-option-filters"
import {
  CatalogFilterFacets,
  CatalogFilters,
  getProductMinimumPrice,
  isProductInStock,
} from "@lib/util/catalog-filters"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

type ProductListQueryParams = (HttpTypes.FindParams &
  HttpTypes.StoreProductListParams) & {
  options?: string[]
  option_value_id?: string | string[]
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: ProductListQueryParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,+type",
          ...queryParams,
        },
        headers,
        cache: "no-store",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  optionValueIds,
  filters,
}: {
  page?: number
  queryParams?: ProductListQueryParams
  sortBy?: SortOptions
  countryCode: string
  optionValueIds?: OptionValueIds
  filters?: CatalogFilters
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  const limit = queryParams?.limit || 12
  const optionFilters = Array.from(
    new Set((optionValueIds || []).filter(Boolean))
  )

  const {
    response: { products },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      ...(optionFilters.length ? { option_value_id: optionFilters } : {}),
      limit: 100,
    },
    countryCode,
  })

  const filteredProducts = products.filter((product) => {
    const inStock = isProductInStock(product)
    const availabilityMatches =
      !filters?.availability.length ||
      filters.availability.length > 1 ||
      (filters.availability[0] === "in-stock" ? inStock : !inStock)
    const minimumPrice = getProductMinimumPrice(product)
    const priceMatches =
      (filters?.minPrice === undefined ||
        (minimumPrice !== undefined && minimumPrice >= filters.minPrice)) &&
      (filters?.maxPrice === undefined ||
        (minimumPrice !== undefined && minimumPrice <= filters.maxPrice))
    const typeMatches =
      !filters?.typeIds.length ||
      (!!product.type?.id && filters.typeIds.includes(product.type.id))
    const productTagIds = (product.tags ?? []).map((tag) => tag.id)
    const tagMatches =
      !filters?.tagIds.length ||
      filters.tagIds.some((tagId) => productTagIds.includes(tagId))

    return availabilityMatches && priceMatches && typeMatches && tagMatches
  })

  const sortedProducts = sortProducts(filteredProducts, sortBy)

  const pageParam = (page - 1) * limit

  const filteredCount = filteredProducts.length

  const nextPage = filteredCount > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count: filteredCount,
    },
    nextPage,
    queryParams,
  }
}

export const getProductFilterFacets = async ({
  countryCode,
  queryParams,
}: {
  countryCode: string
  queryParams?: ProductListQueryParams
}): Promise<CatalogFilterFacets> => {
  const {
    response: { products },
  } = await listProducts({
    pageParam: 1,
    countryCode,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
  })

  const productTypes = new Map<string, { label: string; count: number }>()
  const tags = new Map<string, { label: string; count: number }>()
  let inStock = 0
  let outOfStock = 0
  let currencyCode: string | undefined

  products.forEach((product) => {
    if (isProductInStock(product)) {
      inStock += 1
    } else {
      outOfStock += 1
    }

    if (product.type?.id && product.type.value) {
      const current = productTypes.get(product.type.id)
      productTypes.set(product.type.id, {
        label: product.type.value,
        count: (current?.count ?? 0) + 1,
      })
    }

    const productTags = product.tags ?? []

    productTags.forEach((tag) => {
      if (!tag.id || !tag.value) {
        return
      }

      const current = tags.get(tag.id)
      tags.set(tag.id, {
        label: tag.value,
        count: (current?.count ?? 0) + 1,
      })
    })

    const productCurrencyCode = product.variants?.find(
      (variant) => variant.calculated_price?.currency_code
    )?.calculated_price?.currency_code

    if (!currencyCode && productCurrencyCode) {
      currencyCode = productCurrencyCode
    }
  })

  const toOptions = (
    entries: Map<string, { label: string; count: number }>
  ) =>
    Array.from(entries, ([id, value]) => ({ id, ...value })).sort((a, b) =>
      a.label.localeCompare(b.label)
    )

  return {
    availability: { inStock, outOfStock },
    currencyCode,
    productTypes: toOptions(productTypes),
    tags: toOptions(tags),
  }
}
