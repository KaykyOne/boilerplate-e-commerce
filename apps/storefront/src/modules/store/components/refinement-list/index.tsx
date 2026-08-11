"use client"

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { OPTION_VALUE_QUERY_KEY, parseOptionValueIds } from "@lib/util/product-option-filters"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import OptionsPicker from "./options-picker"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = { sortBy: SortOptions; search?: boolean; hideOptionsPicker?: boolean; "data-testid"?: string }

const FilterContent = ({ selectedValueIds, setOptionValueIds }: { selectedValueIds: string[]; setOptionValueIds: (valueIds: string[]) => void }) => (
  <div className="space-y-7">
    <div className="border-b border-brand-border pb-4"><p className="text-sm font-semibold">Product filters</p><p className="mt-1 text-xs leading-5 text-brand-muted">Options are generated from your Medusa catalog.</p></div>
    <OptionsPicker selectedValueIds={selectedValueIds} setOptionValueIds={setOptionValueIds} />
  </div>
)

const RefinementList = ({ sortBy, hideOptionsPicker = false, "data-testid": dataTestId }: RefinementListProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const updateQueryParams = useCallback((updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())
    updater(params)
    params.delete("page")
    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
  }, [pathname, router, searchParams])
  const setQueryParams = (name: string, value: string) => updateQueryParams((params) => params.set(name, value))
  const selectedOptionValueIds = useMemo(() => parseOptionValueIds(searchParams), [searchParams])
  const setOptionValueIds = (valueIds: string[]) => updateQueryParams((params) => { params.delete(OPTION_VALUE_QUERY_KEY); valueIds.forEach((id) => params.append(OPTION_VALUE_QUERY_KEY, id)) })

  return (
    <>
      <div className="col-span-full grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-end gap-3 small:hidden">
        <button type="button" onClick={() => setMobileOpen(true)} className="h-11 min-w-0 rounded-[var(--radius-control)] border border-brand-border bg-brand-surface text-sm font-semibold">Filters{selectedOptionValueIds.length ? ` (${selectedOptionValueIds.length})` : ""}</button>
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
      </div>
      <aside className="surface-card sticky top-36 hidden p-5 small:block">
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
        {!hideOptionsPicker && <div className="mt-7"><FilterContent selectedValueIds={selectedOptionValueIds} setOptionValueIds={setOptionValueIds} /></div>}
      </aside>
      <Dialog open={mobileOpen} onClose={setMobileOpen} className="relative z-[70] small:hidden">
        <div className="fixed inset-0 bg-black/35" aria-hidden="true" />
        <div className="fixed inset-0 flex items-end">
          <DialogPanel className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-brand-background p-6 shadow-2xl">
            <div className="mb-7 flex items-center justify-between"><DialogTitle className="display-heading text-3xl">Filters</DialogTitle><button onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-brand-border" aria-label="Close filters">×</button></div>
            {!hideOptionsPicker && <FilterContent selectedValueIds={selectedOptionValueIds} setOptionValueIds={setOptionValueIds} />}
            <button onClick={() => setMobileOpen(false)} className="mt-8 h-12 w-full rounded-[var(--radius-control)] bg-brand font-semibold text-brand-contrast">View results</button>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default RefinementList
