import { clx } from "@modules/common/components/ui"

type StockStatusProps = {
  status: "in-stock" | "low-stock" | "out-of-stock"
}

const labels = {
  "in-stock": "In stock",
  "low-stock": "Low stock",
  "out-of-stock": "Out of stock",
}

const StockStatus = ({ status }: StockStatusProps) => (
  <span
    className={clx(
      "inline-flex items-center gap-2 text-[11px] font-semibold",
      status === "in-stock" && "text-brand-success",
      status === "low-stock" && "text-brand-warning",
      status === "out-of-stock" && "text-brand-muted"
    )}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {labels[status]}
  </span>
)

export default StockStatus
