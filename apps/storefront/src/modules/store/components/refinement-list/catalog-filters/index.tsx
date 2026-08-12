"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDownMini } from "@medusajs/icons"
import {
  CATALOG_FILTER_KEYS,
  CatalogFilterFacets,
  CatalogFilterOption,
  CatalogFilters,
} from "@lib/util/catalog-filters"
import { FormEvent, useEffect, useMemo, useState } from "react"

type CatalogFiltersPanelProps = {
  facets: CatalogFilterFacets
  filters: CatalogFilters
  toggleValue: (key: string, value: string) => void
  setPriceRange: (minimum?: number, maximum?: number) => void
}

const FilterCheckbox = ({
  checked,
  count,
  disabled = false,
  label,
  onChange,
}: {
  checked: boolean
  count: number
  disabled?: boolean
  label: string
  onChange: () => void
}) => (
  <label className="flex cursor-pointer items-start gap-3 text-sm text-brand-muted transition hover:text-brand-foreground has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45">
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      className="mt-0.5 h-4 w-4 rounded-[2px] border-brand-input bg-brand-surface text-brand focus:ring-brand-accent"
    />
    <span className="leading-5">
      {label} <span className="text-brand-muted">({count})</span>
    </span>
  </label>
)

const FilterSection = ({
  children,
  title,
  value,
}: {
  children: React.ReactNode
  title: string
  value: string
}) => (
  <Accordion.Item value={value} className="border-b border-brand-border">
    <Accordion.Header>
      <Accordion.Trigger className="group flex w-full items-center justify-between py-5 text-left">
        <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-foreground">
          {title}
        </span>
        <ChevronDownMini className="text-brand-muted transition-transform group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="pb-5">
      <div className="flex flex-col gap-3">{children}</div>
    </Accordion.Content>
  </Accordion.Item>
)

const FacetOptions = ({
  options,
  selectedIds,
  queryKey,
  toggleValue,
}: {
  options: CatalogFilterOption[]
  selectedIds: string[]
  queryKey: string
  toggleValue: (key: string, value: string) => void
}) => (
  <>
    {options.map((option) => (
      <FilterCheckbox
        key={option.id}
        checked={selectedIds.includes(option.id)}
        count={option.count}
        disabled={!option.count && !selectedIds.includes(option.id)}
        label={option.label}
        onChange={() => toggleValue(queryKey, option.id)}
      />
    ))}
  </>
)

const CatalogFiltersPanel = ({
  facets,
  filters,
  toggleValue,
  setPriceRange,
}: CatalogFiltersPanelProps) => {
  const [minimum, setMinimum] = useState(filters.minPrice?.toString() ?? "")
  const [maximum, setMaximum] = useState(filters.maxPrice?.toString() ?? "")

  useEffect(() => {
    setMinimum(filters.minPrice?.toString() ?? "")
    setMaximum(filters.maxPrice?.toString() ?? "")
  }, [filters.maxPrice, filters.minPrice])

  const currencySymbol = useMemo(() => {
    if (!facets.currencyCode) {
      return "$"
    }

    return (
      new Intl.NumberFormat("en", {
        style: "currency",
        currency: facets.currencyCode,
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ??
      facets.currencyCode.toUpperCase()
    )
  }, [facets.currencyCode])

  const submitPrice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const min = minimum === "" ? undefined : Number(minimum)
    const max = maximum === "" ? undefined : Number(maximum)

    setPriceRange(
      Number.isFinite(min) ? min : undefined,
      Number.isFinite(max) ? max : undefined
    )
  }

  return (
    <Accordion.Root
      type="multiple"
      defaultValue={["availability", "price", "product-type", "more"]}
      className="flex flex-col"
    >
      <FilterSection title="Availability" value="availability">
        <FilterCheckbox
          checked={filters.availability.includes("in-stock")}
          count={facets.availability.inStock}
          label="In stock"
          onChange={() =>
            toggleValue(CATALOG_FILTER_KEYS.availability, "in-stock")
          }
        />
        <FilterCheckbox
          checked={filters.availability.includes("out-of-stock")}
          count={facets.availability.outOfStock}
          label="Out of stock"
          onChange={() =>
            toggleValue(CATALOG_FILTER_KEYS.availability, "out-of-stock")
          }
        />
      </FilterSection>

      <FilterSection title="Price" value="price">
        <form onSubmit={submitPrice} className="flex flex-col gap-3">
          <label className="grid grid-cols-[1.25rem_1fr] items-center gap-2 text-sm text-brand-muted">
            <span>{currencySymbol}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={minimum}
              onChange={(event) => setMinimum(event.target.value)}
              placeholder="From"
              className="h-11 w-full rounded-[var(--radius-control)] border border-brand-input bg-brand-surface px-3 text-brand-foreground outline-none transition placeholder:text-brand-muted focus:border-brand-accent"
            />
          </label>
          <label className="grid grid-cols-[1.25rem_1fr] items-center gap-2 text-sm text-brand-muted">
            <span>{currencySymbol}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={maximum}
              onChange={(event) => setMaximum(event.target.value)}
              placeholder="To"
              className="h-11 w-full rounded-[var(--radius-control)] border border-brand-input bg-brand-surface px-3 text-brand-foreground outline-none transition placeholder:text-brand-muted focus:border-brand-accent"
            />
          </label>
          <button
            type="submit"
            className="h-9 border border-brand-border text-[10px] font-bold uppercase tracking-[0.1em] transition hover:border-brand-accent hover:text-brand-accent"
          >
            Apply price
          </button>
        </form>
      </FilterSection>

      {!!facets.productTypes.length && (
        <FilterSection title="Product type" value="product-type">
          <FacetOptions
            options={facets.productTypes}
            selectedIds={filters.typeIds}
            queryKey={CATALOG_FILTER_KEYS.type}
            toggleValue={toggleValue}
          />
        </FilterSection>
      )}

      {!!facets.tags.length && (
        <FilterSection title="More filters" value="more">
          <FacetOptions
            options={facets.tags}
            selectedIds={filters.tagIds}
            queryKey={CATALOG_FILTER_KEYS.tag}
            toggleValue={toggleValue}
          />
        </FilterSection>
      )}
    </Accordion.Root>
  )
}

export default CatalogFiltersPanel
