import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@modules/store/components/refinement-list"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CatalogShellProps = {
  title: string
  description?: string | null
  sortBy: SortOptions
  breadcrumbs?: { label: string; href?: string }[]
  childLinks?: { label: string; href: string }[]
  children: React.ReactNode
}

export default function CatalogShell({ title, description, sortBy, breadcrumbs = [], childLinks = [], children }: CatalogShellProps) {
  return (
    <div className="content-container py-8 small:py-12" data-testid="category-container">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-brand-muted">
        <LocalizedClientLink href="/" className="hover:text-brand-foreground">Home</LocalizedClientLink>
        {breadcrumbs.map((item) => <span className="flex items-center gap-2" key={item.label}><span aria-hidden="true">/</span>{item.href ? <LocalizedClientLink href={item.href} className="hover:text-brand-foreground">{item.label}</LocalizedClientLink> : <span>{item.label}</span>}</span>)}
      </nav>
      <header className="max-w-3xl border-b border-brand-border pb-8">
        <p className="eyebrow mb-3">Browse the catalog</p>
        <h1 className="display-heading text-4xl leading-tight small:text-6xl" data-testid="category-page-title">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-sm leading-6 text-brand-muted small:text-base">{description}</p>}
        {!!childLinks.length && <div className="mt-6 flex flex-wrap gap-2">{childLinks.map((item) => <LocalizedClientLink key={item.href} href={item.href} className="rounded-full border border-brand-border bg-brand-surface px-4 py-2 text-xs font-semibold transition hover:border-brand">{item.label}</LocalizedClientLink>)}</div>}
      </header>
      <div className="mt-8 grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-8 small:grid-cols-[15rem_minmax(0,1fr)]">
        <RefinementList sortBy={sortBy} />
        <div className="min-w-0 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
