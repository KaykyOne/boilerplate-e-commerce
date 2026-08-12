import Image from "next/image"

import { listCategories } from "@lib/data/categories"
import { storefrontConfig } from "@lib/storefront-config"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <LocalizedClientLink href={href} className="text-sm text-brand-contrast/55 transition-colors hover:text-brand-accent">
      {children}
    </LocalizedClientLink>
  </li>
)

export default async function Footer() {
  const categories = await listCategories().catch(() => [])
  const rootCategories = categories.filter((category) => !category.parent_category).slice(0, 6)
  const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo.png`

  return (
    <footer className="mt-20 border-t border-brand-accent/20 bg-brand">
      <div className="content-container py-14 text-brand-contrast small:py-20">
        <div className="grid gap-12 border-b border-brand-accent/15 pb-14 small:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <LocalizedClientLink href="/" className="mb-5 inline-flex items-center">
              <Image src={logoSrc} alt={storefrontConfig.name} width={562} height={410} className="h-auto w-52 object-contain" />
            </LocalizedClientLink>
            <p className="display-heading gold-text text-3xl leading-tight">{storefrontConfig.tagline}</p>
            <p className="mt-5 text-sm leading-6 text-brand-contrast/55">
              A curated selection of cards, collectibles, and geek artifacts presented with the weight each realm deserves.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 xsmall:grid-cols-3">
            <div>
              <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">Catalog</p>
              <ul className="space-y-3">
                {rootCategories.map((category) => <FooterLink key={category.id} href={`/categories/${category.handle}`}>{category.name}</FooterLink>)}
                <FooterLink href="/store">All products</FooterLink>
              </ul>
            </div>
            <div>
              <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">Customer service</p>
              <ul className="space-y-3">{storefrontConfig.footer.support.map((item) => <FooterLink key={item.label} href={item.href}>{item.label}</FooterLink>)}</ul>
            </div>
            <div>
              <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">Information</p>
              <ul className="space-y-3">{storefrontConfig.footer.policies.map((item) => <FooterLink key={item.label} href={item.href}>{item.label}</FooterLink>)}</ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-7 text-xs text-brand-contrast/40 xsmall:flex-row xsmall:items-center xsmall:justify-between">
          <p>© {new Date().getFullYear()} {storefrontConfig.name}. All rights reserved.</p>
          <p className="font-mono uppercase tracking-[0.12em]">Secure payments · Premium curation · Human support</p>
        </div>
      </div>
    </footer>
  )
}
