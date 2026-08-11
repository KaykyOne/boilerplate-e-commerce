"use client"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = { sortBy: SortOptions; setQueryParams: (name: string, value: string) => void; "data-testid"?: string }

const sortOptions = [
  { value: "created_at", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
]

const SortProducts = ({ "data-testid": dataTestId, sortBy, setQueryParams }: SortProductsProps) => (
  <label className="flex min-w-0 flex-col gap-2" data-testid={dataTestId}>
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted">Sort by</span>
    <select value={sortBy} onChange={(event) => setQueryParams("sortBy", event.target.value)} className="h-11 w-full min-w-0 max-w-full rounded-[var(--radius-control)] border border-brand-border bg-brand-surface px-3 text-sm outline-none focus:border-brand">
      {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>
)

export default SortProducts
