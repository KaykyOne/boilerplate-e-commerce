import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { storefrontConfig } from "@lib/storefront-config"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

const SearchIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
)

const UserIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6" />
  </svg>
)

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((items: StoreRegion[]) => items),
    listLocales(),
    getLocale(),
    listCategories().catch(() => []),
  ])

  const rootCategories = categories
    .filter((category) => !category.parent_category)
    .slice(0, 5)

  return (
    <div className="sticky inset-x-0 top-0 z-50 bg-brand-background/95 backdrop-blur-xl">
      <div className="bg-brand px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-contrast">
        {storefrontConfig.announcement}
      </div>
      <header className="border-b border-brand-border bg-brand-surface/95">
        <nav className="content-container grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex h-full items-center gap-5">
            <div className="small:hidden">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} categories={rootCategories} />
            </div>
            <LocalizedClientLink href="/" className="flex items-center gap-3" data-testid="nav-store-link">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-display text-sm text-brand-contrast">{storefrontConfig.shortName}</span>
              <span className="hidden text-sm font-bold uppercase tracking-[0.18em] xsmall:block">{storefrontConfig.name}</span>
            </LocalizedClientLink>
          </div>

          <form action="/store" className="relative hidden w-[min(34vw,32rem)] small:block">
            <label className="sr-only" htmlFor="site-search">Search products</label>
            <input id="site-search" name="q" type="search" placeholder="Search products" className="h-11 w-full rounded-full border border-brand-border bg-brand-background px-5 pr-12 text-sm outline-none transition focus:border-brand" />
            <button type="submit" aria-label="Submit search" className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-foreground"><SearchIcon /></button>
          </form>

          <div className="flex h-full items-center justify-end gap-2 text-sm">
            <LocalizedClientLink href="/store" aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand/5 small:hidden"><SearchIcon /></LocalizedClientLink>
            <LocalizedClientLink href="/account" aria-label="Account" className="hidden h-10 items-center gap-2 rounded-full px-3 hover:bg-brand/5 xsmall:flex" data-testid="nav-account-link">
              <UserIcon /><span className="hidden medium:inline">Account</span>
            </LocalizedClientLink>
            <Suspense fallback={<LocalizedClientLink className="px-2" href="/cart">Cart (0)</LocalizedClientLink>}><CartButton /></Suspense>
          </div>
        </nav>

        <div className="hidden border-t border-brand-border/70 small:block">
          <div className="content-container flex h-11 items-center gap-8 overflow-x-auto text-[12px] font-semibold uppercase tracking-[0.12em]">
            {storefrontConfig.navigation.map((item) => <LocalizedClientLink key={item.label} href={item.href} className="whitespace-nowrap hover:text-brand-accent">{item.label}</LocalizedClientLink>)}
            {rootCategories.map((category) => <LocalizedClientLink key={category.id} href={`/categories/${category.handle}`} className="whitespace-nowrap hover:text-brand-accent">{category.name}</LocalizedClientLink>)}
          </div>
        </div>
      </header>
    </div>
  )
}
