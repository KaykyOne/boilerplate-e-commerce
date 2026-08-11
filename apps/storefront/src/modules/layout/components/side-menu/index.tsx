"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { Locale } from "@lib/data/locales"
import useToggleState from "@lib/hooks/use-toggle-state"
import { storefrontConfig } from "@lib/storefront-config"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@modules/common/components/ui"
import { Fragment } from "react"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  categories?: HttpTypes.StoreProductCategory[]
}

const SideMenu = ({ regions, locales, currentLocale, categories = [] }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const items = [
    ...storefrontConfig.navigation,
    ...categories.map((category) => ({ label: category.name, href: `/categories/${category.handle}` })),
    { label: "Account", href: "/account" },
    { label: "Cart", href: "/cart" },
  ]

  return (
    <div className="h-full">
      <Popover className="flex h-full">
        {({ open, close }) => (
          <>
            <Popover.Button data-testid="nav-menu-button" className="relative flex h-full items-center transition-colors hover:text-brand-accent">
              <span className="flex flex-col gap-1.5" aria-hidden="true"><span className="h-px w-5 bg-current" /><span className="h-px w-5 bg-current" /></span>
              <span className="sr-only">Menu</span>
            </Popover.Button>
            {open && <div className="fixed inset-0 z-50 bg-black/30" onClick={close} data-testid="side-menu-backdrop" />}
            <Transition show={open} as={Fragment} enter="transition duration-200" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition duration-150" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <PopoverPanel className="fixed inset-y-0 left-0 z-[51] flex w-[min(88vw,25rem)] flex-col text-sm text-brand-foreground">
                <div data-testid="nav-menu-popup" className="flex h-full flex-col justify-between border-r border-brand-border bg-brand-background p-7 shadow-2xl">
                  <div>
                    <div className="mb-12 flex items-center justify-between">
                      <span className="text-sm font-bold uppercase tracking-[0.18em]">{storefrontConfig.name}</span>
                      <button className="grid h-10 w-10 place-items-center rounded-full border border-brand-border" data-testid="close-menu-button" onClick={close}><XMark /></button>
                    </div>
                    <ul className="flex flex-col items-start gap-5">
                      {items.map((item) => (
                        <li key={`${item.label}-${item.href}`}><LocalizedClientLink href={item.href} className="display-heading text-3xl hover:text-brand-accent" onClick={close}>{item.label}</LocalizedClientLink></li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-y-5 border-t border-brand-border pt-6">
                    {!!locales?.length && <div className="flex justify-between" onMouseEnter={languageToggleState.open} onMouseLeave={languageToggleState.close}><LanguageSelect toggleState={languageToggleState} locales={locales} currentLocale={currentLocale} /><ArrowRightMini className={clx("transition-transform", languageToggleState.state && "-rotate-90")} /></div>}
                    <div className="flex justify-between" onMouseEnter={countryToggleState.open} onMouseLeave={countryToggleState.close}>{regions && <CountrySelect toggleState={countryToggleState} regions={regions} />}<ArrowRightMini className={clx("transition-transform", countryToggleState.state && "-rotate-90")} /></div>
                    <Text className="text-xs text-brand-muted">© {new Date().getFullYear()} {storefrontConfig.name}</Text>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default SideMenu
