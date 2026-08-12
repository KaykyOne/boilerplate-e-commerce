import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CategoryShowcase = ({ categories }: { categories: HttpTypes.StoreProductCategory[] }) => {
  if (!categories.length) {
    return null
  }

  return (
    <section className="border-y border-brand-border bg-brand-surface-muted py-14 small:py-20">
      <div className="content-container">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">Choose your realm</p>
          <h2 className="display-heading text-3xl leading-none small:text-5xl">Explore the halls of the forge</h2>
          <p className="mt-4 text-sm leading-6 text-brand-muted">Living categories, updated directly from the catalog.</p>
        </div>

        <div className="grid gap-px border border-brand-border bg-brand-border xsmall:grid-cols-2 medium:grid-cols-4">
          {categories.slice(0, 6).map((category, index) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group relative min-h-36 overflow-hidden bg-brand-surface p-6 transition duration-300 hover:-translate-y-1 hover:bg-brand-header hover:text-brand-contrast hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
            >
              <span className="text-[10px] font-bold tracking-[0.18em] text-brand-muted transition group-hover:text-brand-contrast/50">{String(index + 1).padStart(2, "0")}</span>
              <div className="mt-8 flex items-end justify-between gap-4">
                <h3 className="display-heading text-2xl uppercase leading-none">{category.name}</h3>
                <span className="grid h-8 w-8 shrink-0 place-items-center border border-brand-border text-brand-accent transition group-hover:border-brand-accent group-hover:bg-brand-accent group-hover:text-brand-accent-foreground">&rarr;</span>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand-accent transition-transform duration-300 group-hover:scale-x-100" />
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
