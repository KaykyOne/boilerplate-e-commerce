import { clx } from "@modules/common/components/ui"

type ProductBadgeProps = {
  children: React.ReactNode
  tone?: "sale" | "new" | "warning" | "neutral"
}

const ProductBadge = ({ children, tone = "neutral" }: ProductBadgeProps) => (
  <span
    className={clx(
      "inline-flex min-h-6 items-center rounded-[var(--radius-sm)] px-2 py-1 text-[9px] font-bold uppercase leading-none tracking-[0.12em]",
      tone === "sale" && "bg-brand-sale text-brand-accent-foreground",
      tone === "new" && "bg-brand text-brand-contrast",
      tone === "warning" && "bg-brand-warning text-brand-contrast",
      tone === "neutral" && "bg-brand-secondary text-brand-secondary-foreground"
    )}
  >
    {children}
  </span>
)

export default ProductBadge
