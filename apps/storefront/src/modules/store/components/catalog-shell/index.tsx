import Image from "next/image"

import { getProductFilterFacets } from "@lib/data/products"
import { getStaticAssetUrl } from "@lib/util/static-asset"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type CatalogShellProps = {
  title: string
  description?: string | null
  sortBy: SortOptions
  breadcrumbs?: { label: string; href?: string }[]
  childLinks?: { label: string; href: string }[]
  bannerImage?: string
  categoryId?: string
  collectionId?: string
  countryCode: string
  query?: string
  children: React.ReactNode
}

export default async function CatalogShell({
  title,
  description,
  sortBy,
  breadcrumbs = [],
  childLinks = [],
  bannerImage = "/images/catalog-hero-placeholder.webp",
  categoryId,
  collectionId,
  countryCode,
  query,
  children,
}: CatalogShellProps) {
  const facets = await getProductFilterFacets({
    countryCode,
    queryParams: {
      ...(categoryId ? { category_id: [categoryId] } : {}),
      ...(collectionId ? { collection_id: [collectionId] } : {}),
      ...(query ? { q: query } : {}),
    },
  }).catch(() => ({
    availability: { inStock: 0, outOfStock: 0 },
    productTypes: [],
    tags: [],
  }))

  return (
    <div className="content-container py-6 small:py-8" data-testid="category-container">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-muted">
        <LocalizedClientLink href="/" className="hover:text-brand-accent">Home</LocalizedClientLink>
        {breadcrumbs.map((item) => (
          <span className="flex items-center gap-2" key={item.label}>
            <span aria-hidden="true">/</span>
            {item.href ? <LocalizedClientLink href={item.href} className="hover:text-brand-accent">{item.label}</LocalizedClientLink> : <span className="text-brand-foreground">{item.label}</span>}
          </span>
        ))}
      </nav>

      <header className="forge-frame relative min-h-[18rem] overflow-hidden bg-brand small:min-h-[22rem]">
        <Image src={getStaticAssetUrl(bannerImage)} alt="" fill priority className="object-cover object-center opacity-45 grayscale-[20%]" sizes="(max-width: 1440px) 100vw, 1440px" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(207,165,63,0.16),transparent_30%),linear-gradient(90deg,rgba(5,5,6,1),rgba(5,5,6,0.82),rgba(5,5,6,0.18))]" />
        <div className="relative z-10 flex min-h-[18rem] max-w-2xl flex-col justify-center px-6 py-10 text-brand-contrast small:min-h-[22rem] small:px-12">
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-accent">Forge archive</p>
          <h1 className="display-heading text-4xl leading-[0.95] small:text-6xl" data-testid="category-page-title">{title}</h1>
          {description && <p className="mt-5 max-w-xl text-sm leading-6 text-brand-contrast/75 small:text-base">{description}</p>}
          <div className="mt-7 h-1 w-16 bg-brand-accent" aria-hidden="true" />
        </div>
      </header>

      {!!childLinks.length && (
        <div className="flex flex-wrap gap-2 border-x border-b border-brand-border bg-brand-surface-muted p-4 small:px-6">
          <span className="mr-2 self-center text-[10px] font-bold uppercase tracking-[0.12em] text-brand-muted">Shop by</span>
          {childLinks.map((item) => (
            <LocalizedClientLink key={item.href} href={item.href} className="border border-brand-border bg-brand-surface px-4 py-2 text-[10px] font-bold uppercase tracking-[0.08em] transition hover:border-brand hover:bg-brand hover:text-brand-contrast">
              {item.label}
            </LocalizedClientLink>
          ))}
        </div>
      )}

      <div className="mt-8 grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-x-8 gap-y-5 border-t border-brand-border pt-5 small:grid-cols-[15rem_minmax(0,1fr)]">
        <RefinementList facets={facets} sortBy={sortBy} />
        <div className="min-w-0 overflow-hidden small:col-start-2 small:row-start-2">{children}</div>
      </div>
    </div>
  )
}
