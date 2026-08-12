import { Suspense } from "react"
import Image from "next/image"

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

const Search = ({ mobile = false }: { mobile?: boolean }) => (
  <form
    action={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/store`}
    className={mobile ? "relative small:hidden" : "relative hidden w-full max-w-2xl small:block"}
  >
    <label className="sr-only" htmlFor={mobile ? "site-search-mobile" : "site-search"}>
      Search products
    </label>
    <input
      id={mobile ? "site-search-mobile" : "site-search"}
      name="q"
      type="search"
      placeholder="Search artifacts, collections, and categories"
      className="h-11 w-full rounded-[var(--radius-control)] border border-brand-contrast/35 bg-brand-surface px-4 pr-12 text-sm text-brand-foreground outline-none transition placeholder:text-brand-muted focus:border-brand-accent"
    />
    <button
      type="submit"
      aria-label="Submit search"
      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted transition hover:text-brand-foreground"
    >
      <SearchIcon />
    </button>
  </form>
)

export default async function Nav() {
  const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo.png`
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((items: StoreRegion[]) => items),
    listLocales(),
    getLocale(),
    listCategories().catch(() => []),
  ])

  const rootCategories = categories
    .filter((category) => !category.parent_category)
    .slice(0, 6)

  return (
    <div className="sticky inset-x-0 top-0 z-50 bg-brand text-brand-contrast">
      <div className="bg-brand-accent px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-brand-accent-foreground">
        {storefrontConfig.announcement}
      </div>

      <header className="border-b border-brand-contrast/10 bg-brand">
        <nav className="content-container grid h-[var(--header-height)] grid-cols-[auto_1fr_auto] items-center gap-4 small:grid-cols-[13rem_minmax(20rem,1fr)_auto] small:gap-8">
          <div className="flex h-full items-center gap-5">
            <div className="small:hidden">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                categories={rootCategories}
              />
            </div>
            <LocalizedClientLink href="/" className="group flex items-center" data-testid="nav-store-link">
              <Image
                src={logoSrc}
                alt={storefrontConfig.name}
                width={562}
                height={410}
                priority
                className="h-14 w-auto object-contain transition duration-300 group-hover:drop-shadow-[0_0_12px_rgba(207,165,63,0.32)]"
              />
            </LocalizedClientLink>
          </div>

          <Search />

          <div className="flex h-full items-center justify-end gap-1 text-sm">
            <LocalizedClientLink
              href="/account"
              aria-label="Account"
              className="hidden h-10 items-center gap-2 rounded-[var(--radius-sm)] px-3 text-brand-contrast transition hover:bg-brand-contrast/10 xsmall:flex"
              data-testid="nav-account-link"
            >
              <UserIcon />
              <span className="hidden medium:inline">Account</span>
            </LocalizedClientLink>
            <Suspense fallback={<LocalizedClientLink className="px-2" href="/cart">Cart (0)</LocalizedClientLink>}>
              <CartButton />
            </Suspense>
          </div>
        </nav>

        <div className="content-container pb-4 small:hidden">
          <Search mobile />
        </div>

        <div className="hidden border-t border-brand-accent/15 bg-brand-header shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] small:block">
          <div className="content-container flex h-12 items-stretch gap-7 overflow-visible text-[11px] font-bold uppercase tracking-[0.12em] text-brand-contrast">
            {storefrontConfig.navigation.map((item) => (
              <LocalizedClientLink
                key={item.label}
                href={item.href}
                className="flex items-center whitespace-nowrap border-b-2 border-transparent transition hover:border-brand-accent hover:text-brand-contrast"
              >
                {item.label}
              </LocalizedClientLink>
            ))}
            {rootCategories.map((category) => {
              const children = category.category_children ?? []

              return (
                <div key={category.id} className="group relative flex items-stretch">
                  <LocalizedClientLink
                    href={`/categories/${category.handle}`}
                    className="flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent transition hover:border-brand-accent hover:text-brand-contrast"
                  >
                    {category.name}
                    {!!children.length && <span aria-hidden="true" className="text-[9px]">⌄</span>}
                  </LocalizedClientLink>
                  {!!children.length && (
                    <div className="invisible absolute left-0 top-full z-20 w-[22rem] translate-y-1 border border-brand-border bg-brand-surface p-6 text-brand-foreground opacity-0 shadow-[var(--shadow-card-hover)] transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <p className="mb-4 border-b border-brand-border pb-3 text-[10px] text-brand-muted">
                        Browse {category.name}
                      </p>
                      <ul className="grid gap-1 normal-case tracking-normal">
                        {children.slice(0, 8).map((child) => (
                          <li key={child.id}>
                            <LocalizedClientLink
                              href={`/categories/${child.handle}`}
                              className="flex items-center justify-between py-2 text-sm font-medium transition hover:translate-x-1 hover:text-brand-accent"
                            >
                              {child.name}
                              <span aria-hidden="true">→</span>
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                      <LocalizedClientLink
                        href={`/categories/${category.handle}`}
                        className="mt-4 inline-flex border-b border-brand text-xs font-bold uppercase tracking-[0.1em]"
                      >
                        View all
                      </LocalizedClientLink>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </header>
    </div>
  )
}
