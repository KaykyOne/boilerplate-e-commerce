import { Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6">
      <Heading className="font-display text-xl text-brand-foreground">Need help?</Heading>
      <div className="my-2 text-sm text-brand-muted">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink className="text-brand-accent hover:text-brand-foreground" href="/contact">Contact</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink className="text-brand-accent hover:text-brand-foreground" href="/contact">
              Returns & Exchanges
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
