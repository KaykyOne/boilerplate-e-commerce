import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 py-8 small:py-12" data-testid="account-page">
      <div className="content-container max-w-5xl">
        <div className="forge-frame bg-brand-surface px-5 py-8 small:px-10 small:py-12">
          <div
            className={
              customer
                ? "grid grid-cols-1 gap-10 small:grid-cols-[240px_1fr] small:gap-12"
                : "flex min-h-[360px] items-center justify-center"
            }
          >
            {customer && (
              <aside className="border-brand-border/70 small:border-r small:pr-8">
                <AccountNav customer={customer} />
              </aside>
            )}
            <div className={customer ? "min-w-0 text-brand-foreground" : "w-full max-w-md text-brand-foreground"}>
              {children}
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-brand-border/70 pt-8 small:flex-row small:items-end">
            <div>
              <p className="eyebrow mb-2">Suporte</p>
              <h3 className="font-display text-2xl text-brand-foreground">
                Precisa de ajuda?
              </h3>
              <span className="mt-2 block max-w-lg text-sm leading-6 text-brand-muted">
                Encontre respostas e orientações na nossa central de atendimento.
              </span>
            </div>
            <UnderlineLink href="/customer-service">
              Atendimento ao cliente
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
