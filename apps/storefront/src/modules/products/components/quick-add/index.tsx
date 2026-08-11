"use client"

import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function QuickAdd({ product }: { product: HttpTypes.StoreProduct }) {
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string
  const variants = product.variants ?? []
  const variant = variants.length === 1 ? variants[0] : undefined
  const inStock = variant && (!variant.manage_inventory || variant.allow_backorder || (variant.inventory_quantity ?? 0) > 0)

  if (!variant) {
    return <LocalizedClientLink href={`/products/${product.handle}`} className="inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-control)] border border-brand-border bg-brand-surface text-xs font-semibold uppercase tracking-[0.1em] transition hover:border-brand">Choose options</LocalizedClientLink>
  }

  return (
    <button
      type="button"
      disabled={!inStock || isAdding}
      onClick={async () => {
        setIsAdding(true)
        await addToCart({ variantId: variant.id, quantity: 1, countryCode })
        setIsAdding(false)
      }}
      className="h-10 w-full rounded-[var(--radius-control)] bg-brand text-xs font-semibold uppercase tracking-[0.1em] text-brand-contrast transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isAdding ? "Adding…" : inStock ? "Add to cart" : "Out of stock"}
    </button>
  )
}
