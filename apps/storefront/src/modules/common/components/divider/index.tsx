import { clx } from "@modules/common/components/ui"

const Divider = ({ className }: { className?: string }) => (
  <div
    className={clx("mt-1 h-px w-full border-b border-brand-border/70", className)}
  />
)

export default Divider
